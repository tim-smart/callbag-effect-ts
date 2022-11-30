import * as T from "@effect/io/Effect"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { mapEffect } from "./mapEffect.js"

export const tap =
  <R1, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    pipe(
      self,
      mapEffect((a) =>
        pipe(
          f(a),
          T.map(() => a),
        ),
      ),
    )
