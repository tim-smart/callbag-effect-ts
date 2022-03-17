import * as T from "@effect-ts/core/Effect"
import { EffectSource, Signal, Talkback } from "../types"

export const run = <R, E, A>(fa: EffectSource<R, E, A>): T.Effect<R, E, void> =>
  T.withRuntimeM<R, R, E, void>((r) =>
    T.effectAsyncInterrupt<unknown, E, void>((cb) => {
      let aborted = false
      let talkback: Talkback

      fa(r)(Signal.START, (t, d) => {
        if (aborted) return

        switch (t) {
          case Signal.START:
            talkback = d
            talkback(Signal.DATA)
            break

          case Signal.DATA:
            talkback(Signal.DATA)
            break

          case Signal.END:
            cb(d ? T.uncause(T.succeed(d)) : T.unit)
            break
        }
      })

      return T.succeedWith(() => {
        aborted = true
        talkback?.(Signal.END)
      })
    }),
  )
