// ets_tracing: off
import * as Cause from "@effect-ts/core/Effect/Cause"
import * as CB from "strict-callbag-basics"
import { Sink } from "strict-callbag-basics"
import { EffectSource } from "../types"
import { Emitter, emitter } from "./emitter"

type Cleanup = () => void

type Register<E, A> = (emit: Emitter<E, A>) => Cleanup | void

export const asyncPush =
  <E, A>(register: Register<E, A>): EffectSource<unknown, E, A> =>
  (_) =>
    CB.async((sink) => register(emitter(sink)))

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
  return [emitter(sink), () => source]
}

export const asyncEmitter = <E, A>(
  bufferSize = 16,
): readonly [Emitter<E, A>, EffectSource<unknown, E, A>] => {
  const [sink, source] = CB.asyncSink<A, Cause.Cause<E>>()
  return [emitter(sink), () => CB.buffer_(source, bufferSize)]
}

export const asyncSink = <E, A>(): readonly [
  Sink<A, Cause.Cause<E>>,
  EffectSource<unknown, E, A>,
] => {
  const [sink, source] = CB.asyncSink<A, Cause.Cause<E>>()
  return [sink, () => source]
}
