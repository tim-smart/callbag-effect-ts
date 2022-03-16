import { CustomRuntime } from "@effect-ts/core/Effect"
import { Cause } from "@effect-ts/core/Effect/Cause"

export enum Signal {
  START = 0,
  DATA = 1,
  END = 2,
}

export type TalkbackArgs = [signal: Signal.DATA] | [signal: Signal.END]
export type Talkback = (...op: TalkbackArgs) => void

export type SinkArgs<E, A> =
  | [signal: Signal.START, talkback: Talkback]
  | [signal: Signal.DATA, data: A]
  | [signal: Signal.END, error?: E]
export type Sink<E, A> = (...op: SinkArgs<E, A>) => void

export type SourceArgs<E, A> = [signal: Signal.START, sink: Sink<E, A>]
export type Source<E, A> = (...op: SourceArgs<E, A>) => void

export type Callbag<E, A> = Source<E, A> | Sink<E, A>

// Effect variants
export type EffectSource<R, E, A> = (
  r: CustomRuntime<R, unknown>,
) => Source<Cause<E>, A>

export type EffectSink<R, E, A> = (
  r: CustomRuntime<R, unknown>,
) => Sink<Cause<E>, A>

export type EffectCallbag<R, E, A> = EffectSource<R, E, A> | EffectSink<R, E, A>
