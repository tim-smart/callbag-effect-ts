import * as T from "@effect/io/Effect"
import * as O from "@fp-ts/data/Option"
import { pipe } from "strict-callbag-basics"
import { EffectSource } from "../types"
import { fromEffectOption } from "./fromEffectOption"

export const fromEffect = <R, E, A>(
  fa: T.Effect<R, E, A>,
): EffectSource<R, E, A> => fromEffectOption(pipe(fa, T.map(O.some)))
