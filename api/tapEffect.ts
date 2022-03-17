import * as T from "@effect-ts/core/Effect"
import { EffectSource } from "../types"
import { mapEffect_ } from "./mapEffect"

export const tapEffect_ = <R, R1, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (a: A) => T.Effect<R1, E1, any>,
): EffectSource<R & R1, E | E1, A> =>
  mapEffect_<R, R1, E, E1, A, A>(self, (a) => T.map_(f(a), () => a))

export const tapEffect =
  <R, R1, E, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  (self: EffectSource<R, E, A>) =>
    tapEffect_(self, f)
