// ets_tracing: off
import { EffectSource } from "../types"
import * as T from "@effect-ts/core/Effect"
import { catchError_ } from "./catchError"
import { fromEffect } from "./fromEffect"

export const alt_ = <R, R1, E, E1, A, B>(
  self: EffectSource<R, E, A>,
  f: (e: E) => T.Effect<R1, E1, B>,
): EffectSource<R & R1, E1, A | B> => catchError_(self, (e) => fromEffect(f(e)))

/**
 * @ets_data_first alt_
 */
export const alt =
  <R1, E, E1, B>(f: (e: E) => T.Effect<R1, E1, B>) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    alt_(self, f)
