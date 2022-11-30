import * as T from "@effect/io/Effect"
import * as SC from "@effect/io/Schedule"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { catchError } from "./catchError.js"
import { tap } from "./tap.js"
import { unwrap } from "./unwrap.js"

export const retry =
  <R1, E, Z>(schedule: SC.Schedule<R1, E, Z>) =>
  <R, A>(self: EffectSource<R, E, A>): EffectSource<R | R1, E, A> =>
    pipe(
      SC.driver(schedule),
      T.map((driver) => {
        const loop: EffectSource<R | R1, E, A> = pipe(
          self,
          catchError((e) =>
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
          ),
        )

        return loop
      }),
      unwrap,
    )
