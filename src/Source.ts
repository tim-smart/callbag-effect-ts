import type { Cause } from "@effect/io/Cause"
import type * as Runtime from "@effect/io/Runtime"
import type { Source } from "strict-callbag-basics"

export { Signal, pipe } from "strict-callbag-basics"

export type EffectSource<R, E, A> = (
  r: Runtime.Runtime<R>,
) => Source<A, Cause<E>>

export * from "./operators/alt.js"
export * from "./operators/async.js"
export * from "./operators/catchError.js"
export * from "./operators/chain.js"
export * from "./operators/chainPar.js"
export * from "./operators/drain.js"
export * from "./operators/emitter.js"
export * from "./operators/empty.js"
export * from "./operators/filter.js"
export * from "./operators/fail.js"
export * from "./operators/flatten.js"
export * from "./operators/forEach.js"
export * from "./operators/fromEffect.js"
export * from "./operators/fromHub.js"
export * from "./operators/fromIterable.js"
export * from "./operators/fromQueue.js"
export * from "./operators/fromSchedule.js"
export * from "./operators/groupBy.js"
export * from "./operators/halt.js"
export * from "./operators/map.js"
export * from "./operators/mapEffect.js"
export * from "./operators/merge.js"
export * from "./operators/never.js"
export * from "./operators/of.js"
export * from "./operators/overridePull.js"
export * from "./operators/resource.js"
export * from "./operators/retry.js"
export * from "./operators/run.js"
export * from "./operators/share.js"
export * from "./operators/switchMap.js"
export * from "./operators/tap.js"
export * from "./operators/tapError.js"
export * from "./operators/unwrap.js"
export * from "./operators/unwrapScope.js"