import * as T from "@effect/io/Effect"
import * as SC from "@effect/io/Schedule"
import { pipe } from "strict-callbag-basics"
import { repeatEffectOption } from "./repeatEffectOption.js"
import { unwrap } from "./unwrap.js"

export const fromSchedule = <R, A>(schedule: SC.Schedule<R, unknown, A>) =>
  pipe(
    SC.driver(schedule),
    T.map((driver) => repeatEffectOption(driver.next(undefined))),
    unwrap,
  )
