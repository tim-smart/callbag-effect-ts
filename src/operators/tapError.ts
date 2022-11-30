import * as T from "@effect/io/Effect"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { catchError } from "./catchError.js"
import { fromEffect } from "./fromEffect.js"

export const tapError =
  <R1, E, E1>(f: (e: E) => T.Effect<R1, E1, unknown>) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    pipe(
      self,
      catchError((e) => fromEffect(pipe(T.fail(e), T.tapError(f)))),
    )
