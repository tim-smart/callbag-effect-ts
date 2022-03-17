import * as T from "@effect-ts/core/Effect"
import { AsyncCancel } from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { EffectSource, Signal, Talkback } from "../types"

export const unwrapManaged =
  <R, R1, E, E1, A>(
    mfa: M.Managed<R1, E1, EffectSource<R, E, A>>,
  ): EffectSource<R & R1, E | E1, A> =>
  (r) =>
  (_, sink) => {
    let cancel: AsyncCancel<E | E1, void>

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        cancel ??= r.runCancel(
          M.use_(mfa, (fa) =>
            T.effectAsyncInterrupt((cb) => {
              let innerTalkback: Talkback
              let endCalled = false

              const talkback: Talkback = (signal) => {
                innerTalkback?.(signal)
                if (signal === Signal.END) {
                  endCalled = true
                  r.run(cancel)
                }
              }

              fa(r)(Signal.START, (...op) => {
                if (op[0] === Signal.START) {
                  innerTalkback = op[1]
                  sink(Signal.START, talkback)
                  return
                }

                sink(...op)

                if (op[0] === Signal.END) {
                  cb(T.unit)
                }
              })

              return T.succeedWith(() => {
                if (endCalled) return
                innerTalkback?.(Signal.END)
              })
            }),
          ),
          (exit) => {
            if (exit._tag === "Failure") {
              sink(Signal.END, exit.cause)
            }
          },
        )
      } else if (signal === Signal.END && cancel) {
        r.run(cancel)
      }
    })
  }
