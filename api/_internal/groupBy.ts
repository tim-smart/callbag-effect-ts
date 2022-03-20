import filter from "callbag-filter"
import { Signal, Source } from "strict-callbag"
import { createPipe } from "./pipe"

export const groupBy_ =
  <A, E, K>(
    self: Source<A, E>,
    keyFn: (a: A) => K,
  ): Source<readonly [source: Source<A, E>, key: K], E> =>
  (_, sink) => {
    const emitted = new Map<K, Source<A, E>>()

    createPipe(self, sink, {
      onStart: (tb) => {
        tb(Signal.DATA)
      },
      onData: (_tb, data) => {
        const key = keyFn(data)

        if (!emitted.has(key)) {
          const inner: Source<A, E> = filter((a: A) => keyFn(a) === key)(
            self as any,
          ) as any
          emitted.set(key, inner)
          sink(Signal.DATA, [inner, key])
        }
      },
      onEnd: (_tb, err) => {
        sink(Signal.END, err)
        emitted.clear()
      },

      onRequest: (tb) => {
        tb(Signal.DATA)
      },
      onAbort: (_err) => {
        emitted.clear()
      },
    })
  }
