import { EffectSource } from "../Source.js"
import * as CB from "strict-callbag-basics"
import { map } from "./map.js"
import { pipe } from "callbag-effect-ts/Source"
import { Runtime } from "@effect/io/Runtime"

export const groupBy =
  <A, K>(keyFn: (a: A) => K) =>
  <R, E>(
    self: EffectSource<R, E, A>,
  ): EffectSource<
    R,
    E,
    readonly [source: EffectSource<R, E, A>, key: K, data: A]
  > =>
    pipe(
      (r: Runtime<R>) => CB.groupBy_(self(r), keyFn),
      map(([source, key, data]) => [(_) => source, key, data] as const),
    )
