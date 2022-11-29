// ets_tracing: off
import * as T from "@effect/io/Effect"
import * as Either from "@fp-ts/data/Either"
import { noop } from "../Sink"
import { EffectSink, EffectSource, Signal, Talkback } from "../types"
import { pipe } from "strict-callbag-basics"

export const run_ = <R, R1, EI, EO, A>(
  self: EffectSource<R, EI, A>,
  sink: EffectSink<R1, EI, EO, A>,
) /* : T.Effect<R | R1, EI | EO, void> */ =>
  pipe(
    T.runtime<R | R1>(),
    T.flatMap((r) =>
      T.asyncInterrupt<never, EI | EO, void>((cb) => {
        const sinkWithEnv = sink(r)

        let aborted = false
        let talkback: Talkback

        self(r)(Signal.START, (t, d) => {
          if (aborted) {
            if (t === Signal.START) {
              d(Signal.END)
            }
            return
          }

          if (t === Signal.START) {
            talkback = d

            sinkWithEnv(Signal.START, (signal, err) => {
              talkback(signal)

              if (err) {
                aborted = true
                cb(T.die(err))
              }
            })
          } else if (t === Signal.DATA) {
            sinkWithEnv(Signal.DATA, d)
          } else if (t === Signal.END) {
            cb(d ? T.die(d) : T.unit())
          }
        })

        return Either.left(
          T.sync(() => {
            aborted = true
            talkback?.(Signal.END)
          }),
        )
      }),
    ),
  )

export const run =
  <R1, EI, EO, A>(sink: EffectSink<R1, EI, EO, A>) =>
  <R>(self: EffectSource<R, EI, A>) =>
    run_(self, sink)

export const runDrain = <R, E>(self: EffectSource<R, E, unknown>) =>
  run_(self, noop)
