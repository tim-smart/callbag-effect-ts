// ets_tracing: off
import * as Cause from "@effect-ts/core/Effect/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSink, EffectSource } from "../types"
import { Emitter, emitter } from "./emitter"

type Cleanup = () => void

type Register<E, A> = (sink: EffectSink<unknown, E, never, A>) => Cleanup | void

export const asyncPush =
  <E, A>(register: Register<E, A>): EffectSource<unknown, E, A> =>
  (_) =>
    CB.async((sink) => register((_) => sink))

export const async =
  <E, A>(
    register: Register<E, A>,
    bufferSize = 16,
  ): EffectSource<unknown, E, A> =>
  (r) =>
    CB.buffer_(asyncPush(register)(r), bufferSize)

export const asyncEmitterPush = <E, A>(): readonly [
  Emitter<E, A>,
  EffectSource<unknown, E, A>,
] => {
  const [sink, source] = CB.asyncSink<A, Cause.Cause<E>>()
  return [emitter(() => sink), () => source]
}

export const asyncEmitter = <E, A>(
  bufferSize = 16,
): readonly [Emitter<E, A>, EffectSource<unknown, E, A>] => {
  const [sink, source] = CB.asyncSink<A, Cause.Cause<E>>()
  return [emitter(() => sink), () => CB.buffer_(source, bufferSize)]
}

export const asyncSync = <E, A>(): readonly [
  EffectSink<unknown, E, never, A>,
  EffectSource<unknown, E, A>,
] => {
  const [sink, source] = CB.asyncSink<A, Cause.Cause<E>>()
  return [(_) => sink, () => source]
}
