import * as T from "@effect/io/Effect"
import { isSuccess } from "@effect/io/Exit"
import { none } from "@effect/io/Fiber/Id"
import * as O from "@fp-ts/data/Option"
import { AsyncCancel, EffectSource, Signal } from "../types"

export const fromEffectOption =
  <R, E, A>(fa: T.Effect<R, E, O.Option<A>>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let aborted = false
    let running = false
    let cancel: AsyncCancel

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        if (running) return
        running = true
        cancel = r.unsafeRunWith(fa, (e) => {
          if (aborted) return

          if (isSuccess(e)) {
            if (e.value._tag === "Some") {
              sink(Signal.DATA, e.value.value)
            }
            sink(Signal.END, undefined)
          } else {
            sink(Signal.END, e.cause)
          }
        })
      } else if (signal === Signal.END) {
        aborted = true
        if (cancel) {
          cancel(none)(() => {})
        }
      }
    })
  }
