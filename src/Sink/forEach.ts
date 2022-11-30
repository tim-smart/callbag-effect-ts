import { Cause } from "@effect/io/Cause"
import * as T from "@effect/io/Effect"
import * as Exit from "@effect/io/Exit"
import { Signal } from "callbag-effect-ts/Source"
import type { Talkback } from "strict-callbag-basics"
import { EffectSink } from "../Sink.js"

export const forEach =
  <R, E, A>(f: (a: A) => T.Effect<R, E, void>): EffectSink<R, unknown, E, A> =>
  (r) => {
    let talkback: Talkback<Cause<E>>

    return (signal, data) => {
      if (signal === Signal.START) {
        talkback = data
        talkback(Signal.DATA)
      } else if (signal === Signal.DATA) {
        r.unsafeRunAsyncWith(f(data), (exit) => {
          if (Exit.isFailure(exit)) {
            talkback(Signal.END, exit.cause)
          } else {
            talkback(Signal.DATA)
          }
        })
      }
    }
  }
