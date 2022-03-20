// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import * as C from "@effect-ts/core/Effect/Cause"
import * as O from "@effect-ts/core/Option"
import { EffectSource, Signal } from "../types"
import * as Runner from "./_internal/effectRunner"

export const repeatEffectOption =
  <R, E, A>(fa: T.Effect<R, O.Option<E>, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    const runner = Runner.make<R, O.Option<E>>(
      r,
      (cause) => {
        runner.abort()

        if (cause._tag == "Fail") {
          sink(
            Signal.END,
            cause.value._tag === "Some" ? C.fail(cause.value.value) : undefined,
          )
        } else {
          sink(Signal.END, cause as any)
        }
      },
      1,
    )

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        runner.runEffect(T.map_(fa, (a) => sink(Signal.DATA, a)))
      } else if (signal === Signal.END) {
        runner.abort()
      }
    })
  }
