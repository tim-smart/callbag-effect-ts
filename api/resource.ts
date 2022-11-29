import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"
import * as O from "@fp-ts/data/Option"
import { pipe } from "strict-callbag-basics"

export const resource =
  <R, R1, E, E1, A, Acc>(
    initial: Acc,
    project: (
      acc: Acc,
      index: number,
    ) => EffectSource<R1, E1, readonly [O.Option<Acc>, EffectSource<R, E, A>]>,
    cleanup?: (acc: Acc) => void,
  ): EffectSource<R | R1, E | E1, A> =>
  (r) =>
    CB.resource(
      initial,
      (acc, index) => {
        const source = project(acc, index)
        return CB.pipe(
          source(r),
          CB.map(
            ([acc, source]) =>
              [
                pipe(
                  acc,
                  O.match(
                    () => CB.NONE,
                    (a) => a,
                  ),
                ),
                source(r),
              ] as const,
          ),
        )
      },
      cleanup,
    )
