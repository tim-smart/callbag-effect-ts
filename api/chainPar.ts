import { EffectSource } from "../types"
import * as CP from "./_internal/chainPar"

export const chainPar_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    fab: (a: A) => EffectSource<R1, E1, B>,
    maxConcurrency = Infinity,
  ): EffectSource<R & R1, E | E1, B> =>
  (r) =>
    CP.chainPar_(self(r), (a) => fab(a)(r), maxConcurrency)

export const chainPar =
  <R1, E1, A, B>(
    fab: (a: A) => EffectSource<R1, E1, B>,
    maxConcurrency = Infinity,
  ) =>
  <R, E>(fa: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, B> =>
    chainPar_(fa, fab, maxConcurrency)
