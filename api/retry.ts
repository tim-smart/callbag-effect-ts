// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { HasClock } from "@effect-ts/core/Effect/Clock"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { catchError_ } from "./catchError"
import { tap } from "./tap"
import { unwrap } from "./unwrap"

export const retry_ = <R, R1, E, A, Z>(
  self: EffectSource<R, E, A>,
  schedule: SC.Schedule<R1, E, Z>,
): EffectSource<R & R1 & HasClock, E, A> =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => {
      const loop: EffectSource<R & R1 & HasClock, E, A> = catchError_(
        self,
        (e) =>
          pipe(
            driver.next(e),
            T.foldM(
              () => T.succeed(loop),
              () =>
                T.succeed(
                  pipe(
                    loop,
                    tap(() => driver.reset),
                  ),
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
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R & R1 & HasClock, E, A> =>
    retry_(self, schedule)
