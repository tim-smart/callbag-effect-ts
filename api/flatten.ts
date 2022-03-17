// ets_tracing: off
import { pipe } from "@effect-ts/core/Function"
import cbFlatten from "callbag-flatten"
import { EffectSource } from "../types"
import { map_ } from "./map"

export const flatten =
  <R, R1, E, E1, A>(
    source: EffectSource<R, E, EffectSource<R1, E1, A>>,
  ): EffectSource<R & R1, E | E1, A> =>
  (r) =>
    pipe(map_(source, (fa) => fa(r))(r), cbFlatten as any)
