// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { EffectSource } from "../types"
import { mapEffect_ } from "./mapEffect"

export const tap_ = <R, R1, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (a: A) => T.Effect<R1, E1, any>,
): EffectSource<R & R1, E | E1, A> =>
  mapEffect_<R, R1, E, E1, A, A>(self, (a) => T.map_(f(a), () => a))

/**
 * @ets_data_first tap_
 */
export const tap =
  <R1, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    tap_(self, f)
