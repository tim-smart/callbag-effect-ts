import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export function filter<A, B extends A>(
  fab: (a: A) => a is B,
): <R, E>(source: EffectSource<R, E, A>) => EffectSource<R, E, B>

export function filter<A>(
  pred: (a: A) => boolean,
): <R, E>(self: EffectSource<R, E, A>) => EffectSource<R, E, A>

export function filter<A>(pred: (a: A) => boolean) {
  return <R, E>(self: EffectSource<R, E, A>): EffectSource<R, E, A> =>
    (r) =>
      CB.filter_(self(r), pred)
}
