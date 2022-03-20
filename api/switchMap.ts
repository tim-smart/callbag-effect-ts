// ets_tracing: off
import { EffectSource } from "../types"
import * as SwitchMap from "./_internal/switchMap"

export const switchMap_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    fab: (a: A) => EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E | E1, B> =>
  (r) =>
    SwitchMap.switchMap_(self(r), (a) => fab(a)(r))

/**
 * @ets_data_first switchMap_
 */
export const switchMap =
  <R1, E1, A, B>(fab: (a: A) => EffectSource<R1, E1, B>) =>
  <R, E>(fa: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, B> =>
    switchMap_(fa, fab)
