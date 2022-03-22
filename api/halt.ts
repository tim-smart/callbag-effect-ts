import { Cause } from "@effect-ts/core/Effect/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const halt =
  <E>(c: Cause<E>): EffectSource<unknown, E, never> =>
  (_) =>
    CB.error(c)
