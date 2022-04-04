// ets_tracing: off
import * as Cause from "@effect-ts/core/Effect/Cause"
import { Exit } from "@effect-ts/core/Effect/Exit"
import { Sink } from "strict-callbag-basics"

export interface Emitter<E, A> {
  data: (data: A) => void
  fail: (error: E) => void
  halt: (cause: Cause.Cause<E>) => void
  done: (exit: Exit<E, A>) => void
  end: () => void
}

export const emitter = <E, A>(
  sink: Sink<A, Cause.Cause<E>, never>,
): Emitter<E, A> => {
  return {
    data: (a) => sink(1, a),
    end: () => sink(2, undefined),
    halt: (c) => sink(2, c),
    fail: (e) => sink(2, Cause.fail(e)),
    done: (exit) => {
      if (exit._tag === "Failure") {
        return sink(2, exit.cause)
      }

      sink(1, exit.value)
      sink(2, undefined)
    },
  }
}
