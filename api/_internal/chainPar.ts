import { Signal, Source, Talkback } from "strict-callbag"
import { createPipe } from "./createPipe"

const makeLB = <E, A>(
  onData: (a: A) => void,
  onError: (e: E) => void,
  onEnd: () => void,
  onChildEnd: () => void,
) => {
  let parentEnded = false
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

    if (talkbacks.length === 1) {
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

    function maybePullInner() {
      talkback !== undefined && lb.size() < maxInnerCount
        ? talkback(Signal.DATA)
        : undefined
    }

    createPipe(self, sink, {
      onStart(tb) {
        talkback = tb
        lb.pull()
        maybePullInner()
      },
      onData(_, data) {
        const inner = fab(data)
        lb.add(inner)
        maybePullInner()
      },
      onEnd(_, err) {
        if (err) {
          lb.error(err)
        } else {
          lb.end()
        }
      },

      onRequest() {
        lb.pull()
      },
      onAbort() {
        lb.abort()
      },
    })
  }
