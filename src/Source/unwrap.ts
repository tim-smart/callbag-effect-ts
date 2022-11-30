import * as T from "@effect/io/Effect"
import { EffectSource } from "../Source.js"
import { flatten } from "./flatten.js"
import { fromEffect } from "./fromEffect.js"

export const unwrap = <R, R1, E, E1, A>(
  efa: T.Effect<R, E, EffectSource<R1, E1, A>>,
): EffectSource<R | R1, E | E1, A> => flatten(fromEffect(efa))
