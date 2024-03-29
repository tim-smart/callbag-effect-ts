import * as Cause from "@effect/io/Cause"
import * as CB from "strict-callbag-basics"
import { EffectSink } from "../Sink.js"
import { EffectSource } from "../Source.js"
import { Emitter, emitter } from "./emitter.js"

type Cleanup = () => void

type Register<E, A> = (emit: Emitter<E, A>) => Cleanup | void

export const asyncPush =
  <E, A>(register: Register<E, A>): EffectSource<never, E, A> =>
  (_) =>
    CB.asyncP((sink) => register(emitter(sink)))

export const async =
  <E, A>(
    register: Register<E, A>,
    bufferSize = 16,
  ): EffectSource<never, E, A> =>
  (r) =>
    CB.buffer_(asyncPush(register)(r), bufferSize)

/**
 * @tsplus static callbag-effect-ts/Source.EffectSource.Ops asyncEmitterPush
 */
export const asyncEmitterPush = <E, A>(): readonly [
  Emitter<E, A>,
  EffectSource<never, E, A>,
] => {
  const [sink, source] = CB.asyncSinkP<A, Cause.Cause<E>>()
  return [emitter(sink), () => source]
}

/**
 * @tsplus static callbag-effect-ts/Source.EffectSource.Ops asyncEmitter
 */
export const asyncEmitter = <E, A>(
  bufferSize = 16,
): readonly [Emitter<E, A>, EffectSource<never, E, A>] => {
  const [sink, source] = CB.asyncSinkP<A, Cause.Cause<E>>()
  return [emitter(sink), () => CB.buffer_(source, bufferSize)]
}

/**
 * @tsplus static callbag-effect-ts/Source.EffectSource.Ops asyncSink
 */
export const asyncSink = <E, A>(): readonly [
  EffectSink<never, E, never, A>,
  EffectSource<never, E, A>,
] => {
  const [sink, source] = CB.asyncSinkP<A, Cause.Cause<E>>()
  return [() => sink, () => source]
}
