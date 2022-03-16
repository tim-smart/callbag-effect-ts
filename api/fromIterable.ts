import * as CB from "callbag-basics"
import { EffectSource } from "../types"

export const fromIterable =
  <A>(iterable: Iterable<A> | Iterator<A>): EffectSource<unknown, never, A> =>
  (_) =>
    CB.fromIter(iterable) as any
