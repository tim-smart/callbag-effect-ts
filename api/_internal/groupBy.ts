import filter from "callbag-filter"
import share from "callbag-share"
import { Signal, Source } from "strict-callbag"
import { createPipe } from "./createPipe"
const startWith = require("callbag-start-with")

export const groupBy_ =
  <A, E, K>(
    self: Source<A, E>,
    keyFn: (a: A) => K,
  ): Source<readonly [source: Source<A, E>, key: K], E> =>
  (_, sink) => {
    const shared: Source<A, E> = (share as any)(self)
    const emitted = new Map<K, Source<A, E>>()

    createPipe(shared, sink, {
      onStart: (tb) => {
        tb(Signal.DATA)
      },
      onData: (_tb, data) => {
        const key = keyFn(data)

        if (!emitted.has(key)) {
          const inner: Source<A, E> = startWith(data)(
            filter((a: A) => keyFn(a) === key)(shared as any) as any,
          )
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
