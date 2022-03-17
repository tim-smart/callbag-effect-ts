import cbFilter from "callbag-filter"
import { EffectSource } from "../types"

export const filter_ =
  <R, E, A>(
    self: EffectSource<R, E, A>,
    pred: (a: A) => boolean,
  ): EffectSource<R, E, A> =>
  (r) =>
    cbFilter(pred)(self(r) as any) as any

export const filter =
  <A>(fab: (a: A) => boolean) =>
  <R, E>(source: EffectSource<R, E, A>) =>
    filter_(source, fab)
