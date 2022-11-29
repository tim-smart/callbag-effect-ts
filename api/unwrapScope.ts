import * as T from "@effect/io/Effect"
import { pipe, subscribe, Subscription } from "strict-callbag-basics"
import { AsyncCancel, EffectSource, Signal } from "../types"
import * as Scope from "@effect/io/Scope"
import { left } from "@fp-ts/data/Either"
import { isFailure } from "@effect/io/Exit"
import { none } from "@effect/io/Fiber/Id"

export const unwrapScope =
  <R, R1, E, E1, A>(
    mfa: T.Effect<R1, E1, EffectSource<R, E, A>>,
  ): EffectSource<Exclude<R1, Scope.Scope> | R, E | E1, A> =>
  (r) =>
  (_, sink) => {
    let cancel: AsyncCancel
    let innerSub: Subscription | undefined

    sink(Signal.START, (signal) => {
      if (signal === Signal.DATA) {
        innerSub?.pull()

        cancel ??= pipe(
          mfa,
          T.flatMap((fa) =>
            T.asyncInterrupt<never, never, void>((resume) => {
              const sub = subscribe(fa(r), {
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
