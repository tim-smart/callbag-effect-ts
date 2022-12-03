import * as T from "@effect/io/Effect"
import * as Either from "@fp-ts/data/Either"
import { EffectSource, Signal, pipe } from "../Source.js"
import type { Talkback } from "strict-callbag-basics"
import { EffectSink } from "../Sink.js"
import { noop } from "../Sink.js"

export const run = <R, R1, EI, EO, A>(
  self: EffectSource<R, EI, A>,
  sink: EffectSink<R1, EI, EO, A>,
) =>
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
                cb(T.failCause(err))
              }
            })
          } else if (t === Signal.DATA) {
            sinkWithEnv(Signal.DATA, d)
          } else if (t === Signal.END) {
            cb(d ? T.failCause(d) : T.unit())
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

export const runDrain = <R, E>(self: EffectSource<R, E, unknown>) =>
  run(self, noop)
