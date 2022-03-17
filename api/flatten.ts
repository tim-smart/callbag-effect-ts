import { pipe } from "@effect-ts/core/Function"
import * as CB from "callbag-basics"
import { EffectSource } from "../types"
import { map_ } from "./map"

export const flatten =
  <R, R1, E, E1, A>(
    source: EffectSource<R, E, EffectSource<R1, E1, A>>,
  ): EffectSource<R & R1, E | E1, A> =>
  (r) =>
    pipe(map_(source, (fa) => fa(r))(r), CB.flatten as any)
