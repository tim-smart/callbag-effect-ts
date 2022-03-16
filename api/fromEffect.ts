import * as T from "@effect-ts/core/Effect"
import { AsyncCancel } from "@effect-ts/core/Effect"
import { EffectSource, Signal } from "../types"

export const fromEffect =
  <R, E, A>(fa: T.Effect<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let aborted = false
    let cancel: AsyncCancel<E, A>

    sink(Signal.START, (signal) => {
      switch (signal) {
        case Signal.DATA:
          cancel ??= r.runCancel(fa, (e) => {
            if (aborted) return

            if (e._tag === "Success") {
              sink(Signal.DATA, e.value)
              sink(Signal.END)
            } else {
              sink(Signal.END, e.cause)
            }
          })
          break

        case Signal.END:
          aborted = true
          if (cancel) {
            r.run(cancel)
          }
          break
      }
    })
  }
