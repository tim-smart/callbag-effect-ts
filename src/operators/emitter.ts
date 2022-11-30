import * as Cause from "@effect/io/Cause"
import { Exit, isFailure } from "@effect/io/Exit"
import type { Sink } from "strict-callbag-basics"
import { EffectSink } from "../Sink.js"

export interface Emitter<E, A> {
  data: (data: A) => void
  fail: (error: E) => void
  halt: (cause: Cause.Cause<E>) => void
  done: (exit: Exit<E, A>) => void
  end: () => void
}

export const emitter = <E, A>(
  sink: Sink<A, Cause.Cause<E>, any>,
): Emitter<E, A> => ({
  data: (a) => sink(1, a),
  end: () => sink(2, undefined),
  halt: (c) => sink(2, c),
  fail: (e) => sink(2, Cause.fail(e)),
  done: (exit) => {
    if (isFailure(exit)) {
      return sink(2, exit.cause)
    }

    sink(1, exit.value)
    sink(2, undefined)
  },
})

/**
 * Returns an emitter for an `EffectSink` that does not use the environment.
 */
export const emitterUnknown = <E, A>(
  sink: EffectSink<unknown, E, never, A>,
): Emitter<E, A> => emitter(sink(undefined as any))
