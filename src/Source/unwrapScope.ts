import * as T from "@effect/io/Effect"
import * as CB from "strict-callbag-basics"
import { EffectSource, pipe, Signal } from "../Source.js"
import * as Scope from "@effect/io/Scope"
import { left } from "@fp-ts/data/Either"
import { isFailure } from "@effect/io/Exit"
import { none } from "@effect/io/Fiber/Id"
import { AsyncCancel } from "../internal/types.js"

export const unwrapScope =
  <R, R1, E, E1, A>(
    mfa: T.Effect<R1, E1, EffectSource<R, E, A>>,
  ): EffectSource<Exclude<R1, Scope.Scope> | R, E | E1, A> =>
  (r) =>
  (_, sink) => {
    let cancel: AsyncCancel
    let innerSub: CB.Subscription | undefined

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        innerSub?.pull()

        cancel ??= pipe(
          mfa,
          T.flatMap((fa) =>
            T.asyncInterrupt<never, never, void>((resume) => {
              const sub = CB.subscribe(fa(r), {
                onStart() {
                  sub.pull()
                },
                onData(data) {
                  sink(Signal.DATA, data)
                },
                onEnd(err) {
                  sink(Signal.END, err)
                  resume(T.unit())
                },
              })

              sub.listen()
              innerSub = sub

              return left(
                T.sync(() => {
                  sub.cancel()
                }),
              )
            }),
          ),
          T.scoped,
          (a) =>
            r.unsafeRunWith(a, (exit) => {
              if (isFailure(exit)) {
                sink(Signal.END, exit.cause)
              }
            }),
        )
      } else if (signal === Signal.END) {
        if (cancel) cancel(none)(() => {})
      }
    })
  }
