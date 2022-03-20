/// <reference path="../../modules.d.ts" />

import filter from "callbag-filter"
import share from "callbag-share"
import startWith from "callbag-start-with"
import { createPipe, Signal, Source } from "strict-callbag"

export const groupBy_ =
  <A, E, K>(
    self: Source<A, E>,
    keyFn: (a: A) => K,
  ): Source<readonly [source: Source<A, E>, key: K], E> =>
  (_, sink) => {
    const shared: Source<A, E> = (share as any)(self)
    const emitted = new Map<K, Source<A, E>>()

    createPipe(shared, sink, {
      onStart: (s) => s.pull(),
      onData: (_s, data) => {
        const key = keyFn(data)

        if (!emitted.has(key)) {
          const inner = startWith(data)<E>(
            filter((a: A) => keyFn(a) === key)(shared as any) as any,
          )
          emitted.set(key, inner)
          sink(Signal.DATA, [inner, key])
        }
      },
      onEnd: (err) => {
        sink(Signal.END, err)
        emitted.clear()
      },

      onRequest: (s) => s.pull(),
      onAbort: () => {
        emitted.clear()
      },
    })
  }

export const groupBy =
  <A, K>(keyFn: (a: A) => K) =>
  <E>(self: Source<A, E>): Source<readonly [source: Source<A, E>, key: K], E> =>
    groupBy_(self, keyFn)
