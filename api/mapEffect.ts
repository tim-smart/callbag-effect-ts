// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { flow, pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { chain_ } from "./chain"
import { fromEffect } from "./fromEffect"

export const mapEffect_ = <R, R1, E, E1, A, B>(
  self: EffectSource<R, E, A>,
  fab: (a: A) => T.Effect<R1, E1, B>,
): EffectSource<R & R1, E | E1, B> => pipe(chain_(self, flow(fab, fromEffect)))

/**
 * @ets_data_first mapEffect_
 */
export const mapEffect =
  <R1, E1, A, B>(fab: (a: A) => T.Effect<R1, E1, B>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    mapEffect_(self, fab)
