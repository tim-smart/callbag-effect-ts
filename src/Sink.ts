import type { Cause } from "@effect/io/Cause"
import type * as Runtime from "@effect/io/Runtime"
import type { Sink } from "strict-callbag-basics"

export type EffectSink<R, EI, EO, A> = (
  r: Runtime.Runtime<R>,
) => Sink<A, Cause<EI>, Cause<EO>>

export * from "./Sink/forEach.js"
export * from "./Sink/map.js"
export * from "./Sink/noop.js"
