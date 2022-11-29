// ets_tracing: off
import * as T from "@effect/io/Effect"
import * as SC from "@effect/io/Schedule"
import { pipe } from "strict-callbag-basics"
import { EffectSource } from "../types"
import { catchError_ } from "./catchError"
import { tap } from "./tap"
import { unwrap } from "./unwrap"

export const retry_ = <R, R1, E, A, Z>(
  self: EffectSource<R, E, A>,
  schedule: SC.Schedule<R1, E, Z>,
): EffectSource<R | R1, E, A> =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => {
      const loop: EffectSource<R | R1, E, A> = catchError_(self, (e) =>
        pipe(
          driver.next(e),
          T.fold(
            () => loop,
            () =>
              pipe(
                loop,
                tap(() => driver.reset()),
              ),
          ),
          unwrap,
        ),
      )

      return loop
    }),
    unwrap,
  )

/**
 * @ets_data_first retry_
 */
export const retry =
  <R1, E, Z>(schedule: SC.Schedule<R1, E, Z>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E, A> =>
    retry_(self, schedule)
