import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const map =
  <A, B>(fab: (a: A) => B) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R, E, B> =>
  (r) =>
    CB.map_(self(r), fab)
