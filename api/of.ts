// ets_tracing: off
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const of =
  <A>(...as: A[]): EffectSource<never, never, A> =>
  (_) =>
    CB.of(...as)
