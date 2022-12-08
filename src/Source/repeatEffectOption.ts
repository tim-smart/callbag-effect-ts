import * as T from "@effect/io/Effect"
import * as C from "@effect/io/Cause"
import * as O from "@fp-ts/data/Option"
import { EffectSource, pipe, Signal } from "../Source.js"
import * as Runner from "./_internal/effectRunner.js"
import * as Either from "@fp-ts/data/Either"
import { identity } from "@fp-ts/data/Function"

export const repeatEffectOption =
  <R, E, A>(fa: T.Effect<R, O.Option<E>, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    const runner = Runner.make<R, O.Option<E>>(
      r,
      (cause) => {
        runner.abort()

        const newCause = pipe(
          C.failureOrCause(cause),
          Either.match(
            (e) => pipe(e, O.map(C.fail), O.getOrUndefined),
            identity,
          ),
        )

        sink(Signal.END, newCause)
      },
      1,
    )

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        runner.runEffect(fa, (a) => sink(Signal.DATA, a))
      } else if (signal === Signal.END) {
        runner.abort()
      }
    })
  }
