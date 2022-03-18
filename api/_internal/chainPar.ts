import { Signal, Source, Talkback } from "strict-callbag"

const makeLB = <E, A>(
  onData: (a: A) => void,
  onError: (e: E) => void,
  onEnd: () => void,
  onChildEnd: () => void,
) => {
  let parentEnded = false
  let dataWanted = false
  let aborted = false
  let size = 0

  const talkbacks: Talkback[] = []
  let pullIndex = 0

  const add = (source: Source<A, E>) => {
    size++

    let localTalkback: Talkback
    source(Signal.START, (signal, data) => {
      if (aborted) {
        if (signal === Signal.START) data(Signal.END)
        return
      }

      if (signal === Signal.START) {
        localTalkback = data
        addTalkback(localTalkback)
      } else if (signal === Signal.DATA) {
        dataWanted = false
        onData(data)
      } else if (signal === Signal.END) {
        if (data) {
          error(data, localTalkback)
        } else {
          endTalkback(localTalkback)
        }
      }
    })
  }

  const addTalkback = (tb: Talkback) => {
    talkbacks.push(tb)

    if (dataWanted) {
      dataWanted = false
      pull()
    }
  }

  const endTalkback = (tb: Talkback) => {
    const index = talkbacks.indexOf(tb)
    talkbacks.splice(index, 1)
    size--

    if (index < pullIndex) {
      pullIndex--
    }

    if (!size && parentEnded) {
      onEnd()
    } else {
      onChildEnd()
    }
  }

  const end = () => {
    parentEnded = true

    if (!size) {
      onEnd()
    }
  }

  const abort = (from?: Talkback) => {
    aborted = true
    talkbacks.forEach((tb) => from !== tb && tb(Signal.END))
    talkbacks.splice(0)
  }

  const error = (err: E, tb?: Talkback) => {
    abort(tb)
    onError(err)
  }

  const pull = () => {
    dataWanted = true
    if (!talkbacks.length) {
      return
    }

    if (pullIndex >= talkbacks.length) {
      pullIndex = 0
    }

    const puller = talkbacks[pullIndex]
    puller(Signal.DATA)
    pullIndex++
  }

  return {
    pull,
    add,
    end,
    abort,
    error,
    size: () => size,
  } as const
}

export const chainPar_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
    maxInnerCount = Infinity,
  ): Source<B, E | E1> =>
  (_, sink) => {
    const lb = makeLB<E | E1, B>(
      (a) => sink(Signal.DATA, a),
      (e) => sink(Signal.END, e),
      () => sink(Signal.END, undefined),
      () => maybePullInner(),
    )

    let talkback: Talkback
    let sourceStarted = false

    function maybePullInner() {
      talkback !== undefined && lb.size() < maxInnerCount
        ? talkback(Signal.DATA)
        : undefined
    }

    const startSelf = () =>
      self(Signal.START, (signal, data) => {
        if (signal === Signal.START) {
          talkback = data
          talkback(Signal.DATA)
        } else if (signal === Signal.DATA) {
          const inner = fab(data)
          lb.add(inner)
          maybePullInner()
        } else {
          if (data) {
            lb.error(data)
          } else {
            lb.end()
          }
        }
      })

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (!sourceStarted) {
          sourceStarted = true
          startSelf()
        }

        lb.pull()
      } else if (signal === Signal.END) {
        lb.abort()
      }
    })
  }
