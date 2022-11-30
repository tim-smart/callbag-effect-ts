import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const drain =
  <R, E>(fa: EffectSource<R, E, any>): EffectSource<R, E, never> =>
  (r) =>
    CB.drain(fa(r))
