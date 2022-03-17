// ets_tracing: off
import * as C from "@effect-ts/core/Effect/Cause"
import { Signal } from "strict-callbag"
import { EffectSource } from "../types"

export const mapErrorCause_ =
  <R, E, E1, A>(
    self: EffectSource<R, E, A>,
    f: (e: C.Cause<E>) => C.Cause<E1>,
  ): EffectSource<R, E1, A> =>
  (r) =>
  (_, sink) => {
    self(r)(Signal.START, (t, d) => {
      if (t === Signal.END && d) {
        sink(t, f(d))
      } else {
        sink(t, d as any)
      }
    })
  }

/**
 * @ets_data_first mapErrorCause_
 */
export const mapErrorCause =
  <E, E1>(f: (e: C.Cause<E>) => C.Cause<E1>) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    mapErrorCause_(self, f)

export const mapError_ = <R, E, E1, A>(
  self: EffectSource<R, E, A>,
  f: (e: E) => E1,
): EffectSource<R, E1, A> =>
  mapErrorCause_(self, (c) =>
    c._tag === "Fail" ? C.fail(f(c.value)) : (c as C.Cause<E1>),
  )

/**
 * @ets_data_first mapError_
 */
export const mapError =
  <E, E1>(f: (e: E) => E1) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    mapError_(self, f)