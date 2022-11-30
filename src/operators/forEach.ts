import * as T from "@effect/io/Effect"
import * as FE from "../Sink/forEach.js"
import { EffectSource } from "../Source.js"
import { run } from "./run.js"

export const forEach =
  <R1, E1, A>(f: (a: A) => T.Effect<R1, E1, any>) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    run(self, FE.forEach(f))
