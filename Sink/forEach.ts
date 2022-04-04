import * as T from "@effect-ts/core/Effect"
import { Cause } from "@effect-ts/core/Effect/Cause"
import { Signal, Talkback } from "strict-callbag-basics"
import { EffectSink } from "../types"

export const forEach =
  <R, E, A>(f: (a: A) => T.Effect<R, E, void>): EffectSink<R, unknown, E, A> =>
  (r) => {
    let talkback: Talkback<Cause<E>>

    return (signal, data) => {
      if (signal === Signal.START) {
        talkback = data
        talkback(Signal.DATA)
      } else if (signal === Signal.DATA) {
        r.run(f(data), (exit) => {
          if (exit._tag === "Failure") {
            talkback(Signal.END, exit.cause)
          } else {
            talkback(Signal.DATA)
          }
        })
      }
    }
  }

