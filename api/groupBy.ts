import { EffectSource } from "../types"
import * as CB from "strict-callbag-basics"
import { map } from "./map"
import { pipe } from "strict-callbag-basics"
import { Runtime } from "@effect/io/Runtime"

export const groupBy_ = <R, E, A, K>(
  self: EffectSource<R, E, A>,
  keyFn: (a: A) => K,
): EffectSource<
  R,
  E,
  readonly [source: EffectSource<R, E, A>, key: K, data: A]
> =>
  pipe(
    (r: Runtime<R>) => CB.groupBy_(self(r), keyFn),
    map(([source, key, data]) => [(_) => source, key, data] as const),
  )

/**
 * @ets_data_first groupBy_
 */
export const groupBy =
  <A, K>(keyFn: (a: A) => K) =>
  <R, E>(self: EffectSource<R, E, A>) =>
    groupBy_(self, keyFn)
