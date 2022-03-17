// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import * as O from "@effect-ts/core/Option"
import { AsyncCancel } from "@effect-ts/core/Effect"
import { EffectSource, Signal } from "../types"

export const fromEffectOption =
  <R, E, A>(fa: T.Effect<R, E, O.Option<A>>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let aborted = false
    let cancel: AsyncCancel<E, O.Option<A>>

    sink(Signal.START, (signal) => {
      switch (signal) {
        case Signal.DATA:
          cancel ??= r.runCancel(fa, (e) => {
            if (aborted) return

            if (e._tag === "Success") {
              if (e.value._tag === "Some") {
                sink(Signal.DATA, e.value.value)
              }
              sink(Signal.END, undefined)
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
