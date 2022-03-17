// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import { EffectSource } from "../types"
import { fromEffectOption } from "./fromEffectOption"

export const fromEffect = <R, E, A>(
  fa: T.Effect<R, E, A>,
): EffectSource<R, E, A> => fromEffectOption(pipe(fa, T.map(O.some)))
