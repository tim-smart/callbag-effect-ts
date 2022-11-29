import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export function filter_<R, E, A, B extends A>(
  self: EffectSource<R, E, A>,
  pred: (a: A) => a is B,
): EffectSource<R, E, B>

export function filter_<R, E, A>(
  self: EffectSource<R, E, A>,
  pred: (a: A) => boolean,
): EffectSource<R, E, A>

export function filter_<R, E, A>(
  self: EffectSource<R, E, A>,
  pred: (a: A) => boolean,
): EffectSource<R, E, A> {
  return (r) => CB.filter_(self(r), pred)
}

export function filter<A, B extends A>(
  fab: (a: A) => a is B,
): <R, E>(source: EffectSource<R, E, A>) => EffectSource<R, E, B>

export function filter<A>(
  pred: (a: A) => boolean,
): <R, E>(self: EffectSource<R, E, A>) => EffectSource<R, E, A>

export function filter<A>(pred: (a: A) => boolean) {
  return <R, E>(self: EffectSource<R, E, A>) => filter_(self, pred)
}
