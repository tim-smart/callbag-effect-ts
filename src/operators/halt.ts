import { Cause } from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const halt =
  <E>(c: Cause<E>): EffectSource<never, E, never> =>
  (_) =>
    CB.error(c)
