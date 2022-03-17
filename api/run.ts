// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { noop } from "../Sink"
import { EffectSink, EffectSource, Signal, Talkback } from "../types"

export const run_ = <R, R1, EI, EO, A>(
  self: EffectSource<R, EI, A>,
  sink: EffectSink<R1, EI, EO, A>,
): T.Effect<R & R1, EI | EO, void> =>
  T.withRuntimeM<R & R1, R & R1, EI | EO, void>((r) =>
    T.effectAsyncInterrupt<unknown, EI | EO, void>((cb) => {
      const sinkWithEnv = sink(r)

      let aborted = false
      let talkback: Talkback

      self(r)(Signal.START, (t, d) => {
        if (aborted) return

        if (t === Signal.START) {
          talkback = d

          sinkWithEnv(Signal.START, (signal, err) => {
            talkback(signal)

            if (err) {
              aborted = true
              cb(T.halt(err))
            }
          })
        } else if (t === Signal.DATA) {
          sinkWithEnv(Signal.DATA, d)
        } else if (t === Signal.END) {
          cb(d ? T.halt(d) : T.unit)
        }
      })

      return T.succeedWith(() => {
        aborted = true
        talkback?.(Signal.END)
      })
    }),
  )

/**
 * @ets_data_first run_
 */
export const run =
  <R1, EI, EO, A>(sink: EffectSink<R1, EI, EO, A>) =>
  <R>(self: EffectSource<R, EI, A>) =>
    run_(self, sink)

export const runDrain = <R, E>(self: EffectSource<R, E, unknown>) =>
  run_(self, noop)
