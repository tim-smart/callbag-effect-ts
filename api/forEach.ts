import * as T from "@effect-ts/core/Effect"
import { EffectSource } from "../types"
import { tapEffect_ } from "./tapEffect"
import { runDrain } from "./run"

export const forEach_ = <R, R1, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (a: A) => T.Effect<R1, E1, any>,
) => runDrain(tapEffect_(self, f))

export const forEach =
  <R1, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    runDrain(tapEffect_(self, f))
