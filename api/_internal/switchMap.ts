// ets_tracing: off
import {
  createPipe,
  Signal,
  Source,
  subscribe,
  Subscription,
} from "strict-callbag"

export const switchMap_ =
  <E, E1, A, B>(
    self: Source<A, E>,
    fab: (a: A) => Source<B, E1>,
  ): Source<B, E | E1> =>
  (_, sink) => {
    let innerSub: Subscription | undefined
    let sourceEnded = false
    let waitingForData = true

    createPipe(self, sink, {
      onStart(s) {
        s.pull()
      },

      onData(outerSub, data) {
        if (innerSub) {
          innerSub.cancel()
          innerSub = undefined
        }

        const sub = subscribe(fab(data), {
          onStart() {
            sub.pull()
          },

          onData(data) {
            waitingForData = false
            sink(Signal.DATA, data)
          },

          onEnd(err) {
            if (sourceEnded) {
              sink(Signal.END, err)
              return
            }

            if (err) {
              outerSub.cancel()
              sink(Signal.END, err)
            } else if (waitingForData) {
              outerSub.pull()
            }
          },
        })

        sub.listen()
        innerSub = sub
      },

      onEnd(err) {
        sourceEnded = true

        if (err) {
          innerSub?.cancel()
          sink(Signal.END, err)
        } else if (!innerSub) {
          sink(Signal.END, undefined)
        }
      },

      onRequest(s) {
        waitingForData = true

        if (innerSub) {
          innerSub.pull()
        } else {
          s.pull()
        }
      },

      onAbort() {
        innerSub?.cancel()
      },
    })
  }

/**
 * @ets_data_first switchMap_
 */
export const switchMap =
  <E1, A, B>(fab: (a: A) => Source<B, E1>) =>
  <E>(fa: Source<A, E>): Source<B, E | E1> =>
    switchMap_(fa, fab)
