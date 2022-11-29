// ets_tracing: off
import * as CB from "strict-callbag-basics"
import { pipe } from "strict-callbag-basics"
import { EffectSource } from "../types"

export const flatten =
  <R, R1, E, E1, A>(
    source: EffectSource<R, E, EffectSource<R1, E1, A>>,
  ): EffectSource<R | R1, E | E1, A> =>
  (r) =>
    pipe(
      CB.map_(source(r), (fa) => fa(r)),
      CB.flatten,
    )
