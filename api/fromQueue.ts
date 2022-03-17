import * as T from "@effect-ts/core/Effect"
import * as Q from "@effect-ts/core/Effect/Queue"
import { pipe } from "@effect-ts/core/Function"
import { EffectSource, Signal } from "../types"
import * as Runner from "./_internal/effectRunner"

export const fromQueue =
  <R, A>(queue: Q.Dequeue<A>): EffectSource<R, never, A> =>
  (r) =>
  (_, sink) => {
    const runner = Runner.make<R, never>(r, (cause) => {
      runner.abort()
      sink(Signal.END, cause._tag !== "Interrupt" ? cause : undefined)
    })

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        runner.runEffect(
          pipe(
            Q.take(queue),
            T.map((a) => {
              sink(Signal.DATA, a)
            }),
          ),
        )
      } else if (signal === Signal.END) {
        runner.abort()
        sink(Signal.END, undefined)
      }
    })
  }
