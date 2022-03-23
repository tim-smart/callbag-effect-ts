// ets_tracing: off
import * as Cause from "@effect-ts/core/Effect/Cause"
import { Exit } from "@effect-ts/core/Effect/Exit"
import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export interface AsyncEmitter<E, A> {
  data: (data: A) => void
  fail: (error: E) => void
  halt: (cause: Cause.Cause<E>) => void
  done: (exit: Exit<E, A>) => void
  end: () => void
}

type Register<E, A> = (emitter: AsyncEmitter<E, A>) => void

const createEmit = <E, A>(
  emit: CB.AsyncEmitter<Cause.Cause<E>, A>,
): AsyncEmitter<E, A> => ({
  data: emit.data,
  end: emit.end,
  halt: emit.error,
  fail: (e) => emit.error(Cause.fail(e)),
  done: (exit) => {
    if (exit._tag === "Failure") {
      return emit.error(exit.cause)
    }

    emit.data(exit.value)
    emit.end()
  },
})

export const asyncPush =
  <R, E, A>(register: Register<E, A>): EffectSource<R, E, A> =>
  (_) =>
    CB.async((emit) => register(createEmit(emit)))

export const async =
  <R, E, A>(register: Register<E, A>, bufferSize = 16): EffectSource<R, E, A> =>
  (r) =>
    CB.buffer_(asyncPush(register)(r), bufferSize)

export const asyncEmitterPush = <R, E, A>(): readonly [
  AsyncEmitter<E, A>,
  EffectSource<R, E, A>,
] => {
  const [emitter, source] = CB.asyncEmitter<A, Cause.Cause<E>>()
  return [createEmit(emitter), () => source]
}

export const asyncEmitter = <R, E, A>(
  bufferSize = 16,
): readonly [AsyncEmitter<E, A>, EffectSource<R, E, A>] => {
  const [emitter, source] = CB.asyncEmitter<A, Cause.Cause<E>>()
  return [createEmit(emitter), () => CB.buffer_(source, bufferSize)]
}
