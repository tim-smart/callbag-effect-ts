import * as C from "@effect/io/Cause"
import { pipe } from "callbag-effect-ts/Source"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const mapErrorCause =
  <E, E1>(f: (e: C.Cause<E>) => C.Cause<E1>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R, E1, A> =>
  (r) =>
    CB.mapError_(self(r), f)

export const mapError =
  <E, E1>(f: (e: E) => E1) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R, E1, A> =>
    pipe(self, mapErrorCause(C.map(f)))
