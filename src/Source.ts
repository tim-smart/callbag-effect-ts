import type { Cause } from "@effect/io/Cause"
import type * as Runtime from "@effect/io/Runtime"
import type { Source } from "strict-callbag-basics"

export { Signal, pipe } from "strict-callbag-basics"

export type EffectSource<R, E, A> = (
  r: Runtime.Runtime<R>,
) => Source<A, Cause<E>>

export * from "./Source/alt.js"
export * from "./Source/async.js"
export * from "./Source/catchError.js"
export * from "./Source/chain.js"
export * from "./Source/chainPar.js"
export * from "./Source/drain.js"
export * from "./Source/emitter.js"
export * from "./Source/empty.js"
export * from "./Source/filter.js"
export * from "./Source/fail.js"
export * from "./Source/flatten.js"
export * from "./Source/forEach.js"
export * from "./Source/fromEffect.js"
export * from "./Source/fromHub.js"
export * from "./Source/fromIterable.js"
export * from "./Source/fromQueue.js"
export * from "./Source/fromSchedule.js"
export * from "./Source/groupBy.js"
export * from "./Source/halt.js"
export * from "./Source/map.js"
export * from "./Source/mapEffect.js"
export * from "./Source/merge.js"
export * from "./Source/never.js"
export * from "./Source/of.js"
export * from "./Source/overridePull.js"
export * from "./Source/repeatEffectOption.js"
export * from "./Source/resource.js"
export * from "./Source/retry.js"
export * from "./Source/run.js"
export * from "./Source/scan.js"
export * from "./Source/share.js"
export * from "./Source/switchMap.js"
export * from "./Source/tap.js"
export * from "./Source/tapError.js"
export * from "./Source/unwrap.js"
export * from "./Source/unwrapScope.js"
