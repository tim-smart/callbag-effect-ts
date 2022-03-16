import { CustomRuntime } from "@effect-ts/core/Effect";

export enum Signal {
  START = 0,
  DATA = 1,
  END = 2,
}

export type TalkbackArgs = [type: Signal.DATA] | [type: Signal.END];
export type Talkback = (...op: TalkbackArgs) => void;

export type SinkArgs<E, A> =
  | [type: Signal.START, talkback: Talkback]
  | [type: Signal.DATA, data: A]
  | [type: Signal.END, error?: E];
export type Sink<E, A> = (...op: SinkArgs<E, A>) => void;

export type SourceArgs<E, A> = [type: Signal.START, sink: Sink<E, A>];
export type Source<E, A> = (...op: SourceArgs<E, A>) => void;

export type Callbag<E, A> = Source<E, A> | Sink<E, A>;

// Effect variants
export type EffectSource<R, E, A> = (
  r: CustomRuntime<R, unknown>
) => Source<E, A>;
export type EffectSink<R, E, A> = (r: CustomRuntime<R, unknown>) => Sink<E, A>;

export type EffectCallbag<R, E, A> =
  | EffectSource<R, E, A>
  | EffectSink<R, E, A>;
