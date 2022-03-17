// ets_tracing: off
import cbFromIter from "callbag-from-iter"
import { EffectSource } from "../types"

export const fromIterable =
  <A>(iterable: Iterable<A> | Iterator<A>): EffectSource<unknown, never, A> =>
  (_) =>
    cbFromIter(iterable) as any
