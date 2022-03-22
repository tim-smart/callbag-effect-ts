// ets_tracing: off
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const fromIterable =
  <A>(iterable: Iterable<A> | Iterator<A>): EffectSource<unknown, never, A> =>
  (_) =>
    CB.fromIter(iterable)
