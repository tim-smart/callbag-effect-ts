// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { AsyncCancel } from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { subscribe, Subscription } from "strict-callbag-basics"
import { EffectSource, Signal } from "../types"

export const unwrapManaged =
  <R, R1, E, E1, A>(
    mfa: M.Managed<R1, E1, EffectSource<R, E, A>>,
  ): EffectSource<R & R1, E | E1, A> =>
  (r) =>
  (_, sink) => {
    let cancel: AsyncCancel<E | E1, void>
    let innerSub: Subscription | undefined

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        innerSub?.pull()

        cancel ??= r.runCancel(
          M.use_(mfa, (fa) =>
            T.effectAsyncInterrupt((cb) => {
              const sub = subscribe(fa(r), {
                onStart() {
                  sub.pull()
                },
                onData(data) {
                  sink(Signal.DATA, data)
                },
                onEnd(err) {
                  sink(Signal.END, err)
                  cb(T.unit)
                },
              })

              sub.listen()
              innerSub = sub

              return T.succeedWith(() => {
                sub.cancel()
              })
            }),
          ),
          (exit) => {
            if (exit._tag === "Failure") {
              sink(Signal.END, exit.cause)
            }
          },
        )
      } else if (signal === Signal.END) {
        if (cancel) r.run(cancel)
      }
    })
  }
