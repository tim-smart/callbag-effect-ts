import * as T from "@effect/io/Effect"
import { flow } from "@fp-ts/data/Function"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { chain } from "./chain.js"
import { fromEffect } from "./fromEffect.js"

export const mapEffect =
  <R1, E1, A, B>(fab: (a: A) => T.Effect<R1, E1, B>) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R | R1, E | E1, B> =>
    pipe(self, chain(flow(fab, fromEffect)))
