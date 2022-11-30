import * as T from "@effect/io/Effect"
import * as O from "@fp-ts/data/Option"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { fromEffectOption } from "./fromEffectOption.js"

export const fromEffect = <R, E, A>(
  fa: T.Effect<R, E, A>,
): EffectSource<R, E, A> => fromEffectOption(pipe(fa, T.map(O.some)))
