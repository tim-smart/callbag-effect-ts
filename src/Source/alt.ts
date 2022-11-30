import * as T from "@effect/io/Effect"
import { EffectSource, pipe } from "../Source.js"
import { catchError } from "./catchError.js"
import { fromEffect } from "./fromEffect.js"

export const alt =
  <R1, E, E1, B>(f: (e: E) => T.Effect<R1, E1, B>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E1, A | B> =>
    pipe(
      self,
      catchError((e) => fromEffect(f(e))),
    )
