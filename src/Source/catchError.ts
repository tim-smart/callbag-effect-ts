import * as Cause from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource, pipe } from "../Source.js"
import * as Either from "@fp-ts/data/Either"

export const catchError =
  <R1, E, E1, B>(onError: (e: E) => EffectSource<R1, E1, B>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E1, A | B> =>
  (r) =>
    CB.catchError_(self(r), (e) =>
      pipe(
        e,
        Cause.failureOrCause,
        Either.match(
          (e) => onError(e)(r),
          (e) => CB.error(e),
        ),
      ),
    )
