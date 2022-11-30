import { EffectSource } from "../Source.js"
import * as CB from "strict-callbag-basics"

export const mergeIdentical =
  <R, E, A>(...sources: EffectSource<R, E, A>[]): EffectSource<R, E, A> =>
  (r) =>
    CB.mergeIdentical(...sources.map((s) => s(r)))

export const merge =
  <R1, E1, B>(fb: EffectSource<R1, E1, B>) =>
  <R, E, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E | E1, A | B> =>
  (r) =>
    CB.merge_(self(r), fb(r))
