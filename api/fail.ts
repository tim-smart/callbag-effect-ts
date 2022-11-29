import * as C from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const fail =
  <E>(e: E): EffectSource<never, E, never> =>
  (_) =>
    CB.error(C.fail(e))
