// ets_tracing: off
import * as T from "@effect/io/Effect"
import * as C from "@effect/io/Cause"
import * as O from "@fp-ts/data/Option"
import { EffectSource, Signal } from "../types"
import * as Runner from "./_internal/effectRunner"
import { pipe } from "strict-callbag-basics"

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
            cause.error._tag === "Some" ? C.fail(cause.error.value) : undefined,
          )
        } else {
          sink(Signal.END, cause as any)
        }
      },
      1,
    )

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        runner.runEffect(
          pipe(
            fa,
            T.map((a) => sink(Signal.DATA, a)),
          ),
        )
      } else if (signal === Signal.END) {
        runner.abort()
      }
    })
  }
