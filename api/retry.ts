import * as T from "@effect-ts/core/Effect"
import { HasClock } from "@effect-ts/core/Effect/Clock"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { catchError_ } from "./catchError"
import { tapEffect } from "./tapEffect"
import { unwrap } from "./unwrap"

export const retry_ = <R, E, A, Z>(
  self: EffectSource<R, E, A>,
  schedule: SC.Schedule<R, E, Z>,
): EffectSource<R & HasClock, E, A> =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => {
      const loop: EffectSource<R & HasClock, E, A> = catchError_(self, (e) =>
        pipe(
          driver.next(e),
          T.foldM(
            () => T.succeed(loop),
            () =>
              T.succeed(
                pipe(
                  loop,
                  tapEffect(() => driver.reset),
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

export const retry =
  <R, E, Z>(schedule: SC.Schedule<R, E, Z>) =>
  <A>(self: EffectSource<R, E, A>): EffectSource<R & HasClock, E, A> =>
    retry_(self, schedule)
