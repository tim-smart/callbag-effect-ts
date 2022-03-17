import * as C from "@effect-ts/core/Collections/Immutable/Chunk"
import { Chunk } from "@effect-ts/core/Collections/Immutable/Chunk"
import * as T from "@effect-ts/core/Effect"
import * as Cause from "@effect-ts/core/Effect/Cause"
import { Exit } from "@effect-ts/core/Effect/Exit"
import * as Q from "@effect-ts/core/Effect/Queue"
import { flow, pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import { EffectSource, Signal, Talkback } from "../types"
import * as Runner from "./_internal/effectRunner"

export interface AsyncEmitter<E, A> {
  single: (data: A) => void
  chunk: (chunk: C.Chunk<A>) => void
  fail: (error: E) => void
  done: (exit: Exit<E, A>) => void
  end: () => void
}

type Register<E, A> = (emitter: AsyncEmitter<E, A>) => void

const EOF = Symbol()
type EOF = typeof EOF

const asyncImpl =
  <R, E, A, X>(
    register: Register<E, A>,
    bufferSize = 32,
    take: (
      buffer: Q.Queue<A | EOF>,
    ) => T.Effect<unknown, E, readonly [O.Option<X>, boolean]>,
  ): EffectSource<R, E, X> =>
  (r) =>
  (_, sink) => {
    const pushRunner = Runner.make(r, failWithCause)
    const pumpRunner = Runner.make(r, failWithCause)
    const buffer = Q.unsafeMakeDropping<A | EOF>(bufferSize)

    let completed = false
    const cleanup = () => {
      completed = true
      pushRunner.abort(Q.shutdown(buffer))
      pumpRunner.abort()
    }

    const chunk = (chunk: C.Chunk<A>) => {
      if (completed) return
      return pushRunner.runEffect(Q.offerAll_(buffer, chunk))
    }
    const single = (data: A) => {
      if (completed) return
      return pushRunner.runEffect(Q.offer_(buffer, data))
    }

    function failWithCause(error: Cause.Cause<E>) {
      cleanup()
      sink(Signal.END, error)
    }
    const fail = (error: E) => {
      if (completed) return
      return failWithCause(Cause.fail(error))
    }

    const end = () => {
      if (completed) return
      completed = true
      pushRunner.runEffect(Q.offer_(buffer, EOF))
    }

    const done = (exit: Exit<E, A>) => {
      if (completed) return
      completed = true

      if (exit._tag === "Failure") {
        return failWithCause(exit.cause)
      }

      pushRunner.runEffect(Q.offerAll_(buffer, C.make(exit.value, EOF)))
    }

    register({
      single,
      chunk,
      fail,
      end,
      done,
    })

    const pump = () =>
      pumpRunner.runEffect(
        pipe(
          take(buffer),
          T.tap(([a, eof]) =>
            T.succeedWith(() => {
              if (a._tag === "Some") {
                sink(Signal.DATA, a.value)
              }

              if (eof) {
                cleanup()
                sink(Signal.END)
              }
            }),
          ),
          T.ignore,
        ),
      )

    const talkback: Talkback = (...op) => {
      switch (op[0]) {
        case Signal.DATA:
          pump()
          break

        case Signal.END:
          cleanup()
          break
      }
    }

    sink(Signal.START, talkback)
  }

export const async = <R, E, A>(register: Register<E, A>, bufferSize = 32) =>
  asyncImpl<R, E, A, A>(
    register,
    bufferSize,
    flow(
      Q.take,
      T.map((a) => (a === EOF ? [O.none, true] : [O.some(a), false])),
    ),
  )

export const asyncChunk = <R, E, A>(
  register: Register<E, A>,
  bufferSize = 32,
  maxChunkSize = 16,
) =>
  asyncImpl<R, E, A, Chunk<A>>(
    register,
    bufferSize,
    flow(
      Q.takeAllUpTo(maxChunkSize),
      T.map((chunk) => {
        const complete = C.unsafeLast(chunk) === EOF

        const filtered: Chunk<A> = complete
          ? (C.take_(chunk, chunk.length - 1) as any)
          : (chunk as any)

        const option = filtered.length ? O.some(filtered) : O.none

        return complete ? [option, true] : [option, false]
      }),
    ),
  )
