import { Clock } from "@effect/io/Clock"
import * as T from "@effect/io/Effect"
import * as SC from "@effect/io/Schedule"
import { pipe } from "strict-callbag-basics"
import { EffectSource } from "../types"
import { repeatEffectOption } from "./repeatEffectOption"
import { unwrap } from "./unwrap"

export const fromSchedule = <R, A>(
  schedule: SC.Schedule<R, unknown, A>,
): EffectSource<R | Clock, never, A> =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => repeatEffectOption(driver.next(undefined))),
    unwrap,
  )
