// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { catchError_ } from "./catchError"
import { fromEffect } from "./fromEffect"

export const tapError_ = <R, R1, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (e: E) => T.Effect<R1, E1, unknown>,
): EffectSource<R & R1, E | E1, A> =>
  catchError_(self, (e) => fromEffect(pipe(T.fail(e), T.tapError(f))))

/**
 * @ets_data_first tapError_
 */
export const tapError =
  <R1, E, E1>(f: (e: E) => T.Effect<R1, E1, unknown>) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    tapError_(self, f)
