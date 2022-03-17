// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { HasClock } from "@effect-ts/core/Effect/Clock"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { EffectSource } from "../types"
import { repeatEffectOption } from "./repeatEffectOption"
import { unwrap } from "./unwrap"

export const fromSchedule = <R, A>(
  schedule: SC.Schedule<R, unknown, A>,
): EffectSource<R & HasClock, never, A> =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => repeatEffectOption(driver.next(undefined))),
    unwrap,
  )
