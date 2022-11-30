import { Cause } from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const catchError =
  <R1, E, E1, B>(onError: (e: E) => EffectSource<R1, E1, B>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E1, A | B> =>
  (r) =>
    CB.catchError_(self(r), (e) =>
      e._tag === "Fail" ? onError(e.error)(r) : CB.error(e as Cause<E1>),
    )
