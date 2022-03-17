// ets_tracing: off
import cbFilter from "callbag-filter"
import { EffectSource } from "../types"

export const filter_ =
  <R, E, A>(
    self: EffectSource<R, E, A>,
    pred: (a: A) => boolean,
  ): EffectSource<R, E, A> =>
  (r) =>
    cbFilter(pred)(self(r) as any) as any

/**
 * @ets_data_first filter_
 */
export const filter =
  <A>(fab: (a: A) => boolean) =>
  <R, E>(source: EffectSource<R, E, A>) =>
    filter_(source, fab)
