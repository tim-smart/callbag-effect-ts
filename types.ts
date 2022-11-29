import type * as Runtime from "@effect/io/Runtime"
import type { Cause } from "@effect/io/Cause"
import type { Sink, Source } from "strict-callbag-basics"
import { unsafeRunWith } from "@effect/io/Effect"

export { Signal, Talkback } from "strict-callbag-basics"

// Effect variants
export type EffectSource<R, E, A> = (
  r: Runtime.Runtime<R>,
) => Source<A, Cause<E>>

export type EffectSink<R, EI, EO, A> = (
  r: Runtime.Runtime<R>,
) => Sink<A, Cause<EI>, Cause<EO>>

export type AsyncCancel = ReturnType<typeof unsafeRunWith>
