// ets_tracing: off
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const map_ =
  <R, E, A, B>(
    self: EffectSource<R, E, A>,
    fab: (a: A) => B,
  ): EffectSource<R, E, B> =>
  (r) =>
    CB.map_(self(r), fab)

/**
 * @ets_data_first map_
 */
export const map =
  <A, B>(fab: (a: A) => B) =>
  <R, E>(source: EffectSource<R, E, A>) =>
    map_(source, fab)
