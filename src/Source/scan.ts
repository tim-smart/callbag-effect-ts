import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const scan =
  <A, B>(seed: B, reducer: (acc: B, a: A) => B) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R, E, B> =>
  (r) =>
    CB.scan_(self(r), reducer, seed)
