// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import * as FE from "../Sink/forEach"
import { EffectSource } from "../types"
import { run_ } from "./run"

export const forEach_ = <R, R1, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (a: A) => T.Effect<R1, E1, any>,
) => run_(self, FE.forEach(f))

/**
 * @ets_data_first forEach_
 */
export const forEach =
  <R1, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    forEach_(self, f)
