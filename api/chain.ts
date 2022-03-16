import { pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { flatten } from "./flatten"
import { map_ } from "./map"

export const chain_ = <R, R1, E, E1, A, B>(
  self: EffectSource<R, E, A>,
  fab: (a: A) => EffectSource<R1, E1, B>,
): EffectSource<R & R1, E | E1, B> => pipe(map_(self, fab), flatten)

export const chain =
  <R, R1, E, E1, A, B>(fab: (a: A) => EffectSource<R1, E1, B>) =>
  (fa: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, B> =>
    chain_(fa, fab)
