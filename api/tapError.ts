// ets_tracing: off
import { EffectSource } from "../types"
import { mapError_ } from "./mapError"

export const tapError_ = <R, E, A>(
  self: EffectSource<R, E, A>,
  f: (e: E) => void,
): EffectSource<R, E, A> =>
  mapError_(self, (e) => {
    f(e)
    return e
  })

/**
 * @ets_data_first tapError_
 */
export const tapError =
  <E>(f: (e: E) => void) =>
  <R, A>(self: EffectSource<R, E, A>) =>
    tapError_(self, f)
