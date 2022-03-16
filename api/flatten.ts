import { flow } from "@effect-ts/core/Function"
import * as CB from "callbag-basics"
import { EffectSource } from "../types"

export const flatten = <R, R1, E, E1, A>(
  source: EffectSource<R, E, EffectSource<R1, E1, A>>,
): EffectSource<R & R1, E | E1, A> => flow(source, CB.flatten as any)
