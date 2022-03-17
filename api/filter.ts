// ets_tracing: off
import cbFilter from "callbag-filter"
import { EffectSource } from "../types"

export const filter_ =
  <R, E, A, B extends A>(
    self: EffectSource<R, E, A>,
    pred: (a: A) => a is B,
  ): EffectSource<R, E, B> =>
  (r) =>
    cbFilter(pred)(self(r) as any) as any

/**
 * @ets_data_first filter_
 */
export const filter =
  <A, B extends A>(fab: (a: A) => a is B) =>
  <R, E>(source: EffectSource<R, E, A>) =>
    filter_(source, fab)
