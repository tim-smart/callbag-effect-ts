// ets_tracing: off
import { Cause } from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const catchError_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    onError: (e: E) => EffectSource<R1, E1, B>,
  ): EffectSource<R | R1, E1, A | B> =>
  (r) =>
    CB.catchError_(self(r), (e) =>
      e._tag === "Fail" ? onError(e.error)(r) : CB.error(e as Cause<E1>),
    )

/**
 * @ets_data_first catchError_
 */
export const catchError =
  <R1, E, E1, B>(onError: (e: E) => EffectSource<R1, E1, B>) =>
  <R, A>(fa: EffectSource<R, E, A>) =>
    catchError_(fa, onError)
