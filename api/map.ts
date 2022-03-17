import cbMap from "callbag-map"
import { EffectSource } from "../types"

export const map_ =
  <R, E, A, B>(
    self: EffectSource<R, E, A>,
    fab: (a: A) => B,
  ): EffectSource<R, E, B> =>
  (r) =>
    cbMap(fab)(self(r) as any) as any

export const map =
  <R, E, A, B>(fab: (a: A) => B) =>
  (source: EffectSource<R, E, A>) =>
    map_(source, fab)
