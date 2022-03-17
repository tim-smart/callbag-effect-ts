import * as T from "@effect-ts/core/Effect"
import { EffectSink, EffectSource, Signal, Sink, Talkback } from "../types"

export const run = <R, R1, E, A>(
  self: EffectSource<R, E, A>,
  sink: EffectSink<R1, E, A>,
): T.Effect<R, E, void> =>
  T.withRuntimeM<R, R, E, void>((r) =>
    T.effectAsyncInterrupt<unknown, E, void>((cb) => {
      let aborted = false
      let talkback: Talkback

      self(r)(Signal.START, (t, d) => {
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
