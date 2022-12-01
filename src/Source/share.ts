import * as T from "@effect/io/Effect"
import { pipe } from "callbag-effect-ts/Source"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const share = <R, E, A>(self: EffectSource<R, E, A>) =>
  pipe(
    T.runtime<R>(),
    T.map((runtime) => CB.share(self(runtime))),
    T.map(
      (source): EffectSource<never, E, A> =>
        (_) =>
          source,
    ),
  )
