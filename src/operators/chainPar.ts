import { EffectSource } from "../Source.js"
import * as CB from "strict-callbag-basics"

export const chainPar =
  <R1, E1, A, B>(
    fab: (a: A) => EffectSource<R1, E1, B>,
    maxConcurrency = Infinity,
  ) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R | R1, E | E1, B> =>
  (r) =>
    CB.chainPar_(self(r), (a) => fab(a)(r), maxConcurrency)
