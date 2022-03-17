import { CustomRuntime } from "@effect-ts/core/Effect"
import { Cause } from "@effect-ts/core/Effect/Cause"

export enum Signal {
  START = 0,
  DATA = 1,
  END = 2,
}

export type TalkbackArgs<E> =
  | [signal: Signal.DATA]
  | [signal: Signal.END, error?: E]
export type Talkback<E = never> = (...op: TalkbackArgs<E>) => void

export type SinkArgs<A, EI, EO> =
  | [signal: Signal.START, talkback: Talkback<EO>]
  | [signal: Signal.DATA, data: A]
  | [signal: Signal.END, error: EI | undefined]
export type Sink<A, EI = unknown, EO = never> = (
  ...op: SinkArgs<A, EI, EO>
) => void

export type SourceArgs<A, EO = unknown> = [
  signal: Signal.START,
  sink: Sink<A, EO, any>,
]
export type Source<A, EO = unknown> = (...op: SourceArgs<A, EO>) => void

// Effect variants
export type EffectSource<R, E, A> = (
  r: CustomRuntime<R, unknown>,
) => Source<Cause<E>, A>

export type EffectSink<R, E, A> = (
  r: CustomRuntime<R, unknown>,
) => Sink<Cause<E>, A>

export type EffectCallbag<R, E, A> = EffectSource<R, E, A> | EffectSink<R, E, A>
