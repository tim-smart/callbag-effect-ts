// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { AsyncCancel } from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { Signal } from "strict-callbag-basics"
import { EffectSource } from "../types"

export const fromManaged =
  <R, E, A>(fa: M.Managed<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let aborted = false
    let cancel: AsyncCancel<E, void>

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        cancel ??= r.runCancel(
          M.use_(fa, (a) => {
            if (aborted) return T.unit
            sink(Signal.DATA, a)
            return T.never
          }),
          (e) => {
            if (aborted) return

            if (e._tag === "Success") {
              sink(Signal.END, undefined)
            } else {
              sink(Signal.END, e.cause)
            }
          },
        )
      } else if (signal === Signal.END) {
        aborted = true
        if (cancel) {
          r.runFiber(cancel)
        }
      }
    })
  }
