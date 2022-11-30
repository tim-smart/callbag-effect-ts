import * as CB from "strict-callbag-basics"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"

export const flatten =
  <R, R1, E, E1, A>(
    source: EffectSource<R, E, EffectSource<R1, E1, A>>,
  ): EffectSource<R | R1, E | E1, A> =>
  (r) =>
    pipe(
      CB.map_(source(r), (fa) => fa(r)),
      CB.flatten,
    )
