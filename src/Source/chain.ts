import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const chain =
  <R1, E1, A, B>(fab: (a: A) => EffectSource<R1, E1, B>) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R | R1, E | E1, B> =>
  (r) =>
    CB.chain_(self(r), (a) => fab(a)(r))
