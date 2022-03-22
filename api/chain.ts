// ets_tracing: off

import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const chain_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    fab: (a: A) => EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E | E1, B> =>
  (r) =>
    CB.chain_(self(r), (a) => fab(a)(r))

/**
 * @ets_data_first chain_
 */
export const chain =
  <R1, E1, A, B>(fab: (a: A) => EffectSource<R1, E1, B>) =>
  <R, E>(fa: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, B> =>
    chain_(fa, fab)
