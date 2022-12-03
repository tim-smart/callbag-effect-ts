import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const filter: {
  <A, B extends A>(fab: (a: A) => a is B): <R, E>(
    self: EffectSource<R, E, A>,
  ) => EffectSource<R, E, B>
  <A>(fab: (a: A) => boolean): <R, E>(
    self: EffectSource<R, E, A>,
  ) => EffectSource<R, E, A>
} =
  <A>(pred: (a: A) => boolean) =>
  <R, E>(self: EffectSource<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
    CB.filter_(self(r), pred)
