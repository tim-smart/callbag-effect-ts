import { CustomRuntime } from "@effect-ts/core/Effect"
import { Cause } from "@effect-ts/core/Effect/Cause"
import { Sink, Source } from "strict-callbag"

export { Signal, Talkback } from "strict-callbag"

// Effect variants
export type EffectSource<R, E, A> = (
  r: CustomRuntime<R, unknown>,
) => Source<A, Cause<E>>

export type EffectSink<R, EI, EO, A> = (
  r: CustomRuntime<R, unknown>,
) => Sink<A, Cause<EI>, Cause<EO>>
