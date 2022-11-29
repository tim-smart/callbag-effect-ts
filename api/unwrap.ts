import * as T from "@effect/io/Effect"
import { EffectSource } from "../types"
import { flatten } from "./flatten"
import { fromEffect } from "./fromEffect"

export const unwrap = <R, R1, E, E1, A>(
  efa: T.Effect<R, E, EffectSource<R1, E1, A>>,
): EffectSource<R | R1, E | E1, A> => flatten(fromEffect(efa))
