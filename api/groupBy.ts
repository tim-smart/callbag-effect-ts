import { EffectSource } from "../types"
import * as CB from "strict-callbag-basics"
import { map } from "./map"
import { pipe } from "@effect-ts/core"
import { CustomRuntime } from "@effect-ts/core/Effect"

export const groupBy_ = <R, E, A, K>(
  self: EffectSource<R, E, A>,
  keyFn: (a: A) => K,
): EffectSource<R, E, readonly [source: EffectSource<R, E, A>, key: K]> =>
  pipe(
    (r: CustomRuntime<R, unknown>) => CB.groupBy_(self(r), keyFn),
    map(([source, key]) => [(_) => source, key] as const),
  )

/**
 * @ets_data_first groupBy_
 */
export const groupBy =
  <A, K>(keyFn: (a: A) => K) =>
  <R, E>(
    self: EffectSource<R, E, A>,
  ): EffectSource<R, E, readonly [source: EffectSource<R, E, A>, key: K]> =>
    groupBy_(self, keyFn)
