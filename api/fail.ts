import * as C from "@effect-ts/core/Effect/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const fail =
  <E>(e: E): EffectSource<unknown, E, never> =>
  (_) =>
    CB.error(C.fail(e))
