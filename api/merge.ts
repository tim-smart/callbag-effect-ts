import { EffectSource } from "../types"
import cbMerge from "callbag-merge"

export const merge_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    fb: EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E | E1, A | B> =>
  (r) =>
    cbMerge(self(r) as any, fb(r)) as any

export const merge =
  <R1, E1, B>(fb: EffectSource<R1, E1, B>) =>
  <R, E, A>(self: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, A | B> =>
  (r) =>
    cbMerge(self(r) as any, fb(r)) as any
