// ets_tracing: off
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const drain =
  <R, E>(fa: EffectSource<R, E, any>): EffectSource<R, E, never> =>
  (r) =>
    CB.drain(fa(r))
