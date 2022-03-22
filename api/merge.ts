// ets_tracing: off
import { EffectSource } from "../types"
import * as CB from "strict-callbag-basics"

export const merge_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    fb: EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E | E1, A | B> =>
  (r) =>
    CB.merge_(self(r), fb(r))

/**
 * @ets_data_first merge_
 */
export const merge =
  <R1, E1, B>(fb: EffectSource<R1, E1, B>) =>
  <R, E, A>(self: EffectSource<R, E, A>) =>
    merge_(self, fb)
