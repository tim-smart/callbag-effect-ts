import * as T from "@effect/io/Effect"
import * as Cause from "@effect/io/Cause"
import * as Exit from "@effect/io/Exit"
import { Runtime } from "@effect/io/Runtime"
import * as FiberId from "@effect/io/Fiber/Id"

type Cancel = ReturnType<typeof T.unsafeRunWith>

export const make = <R, E>(
  r: Runtime<R>,
  onFail: (cause: Cause.Cause<E>) => void,
  capacity = Infinity,
) => {
  let effects: T.Effect<R, E, any>[] = []
  let effectsOffset = 0
  const waitingCount = () => effects.length - effectsOffset
  const resetEffects = () => {
    effects = []
    effectsOffset = 0
  }

  let currentCancel: Cancel | undefined = undefined

  let aborted = false

  const abort = (cleanup?: T.Effect<never, never, void>) => {
    if (aborted) return

    resetEffects()

    if (currentCancel) {
      currentCancel(FiberId.none)(() => {})
    }

    if (cleanup) {
      runEffect(cleanup)
    }

    aborted = true
  }

  const runEffect = <A>(e: T.Effect<R, E, A>, cb?: (a: A) => void) => {
    if (aborted) return

    if (!currentCancel && !effects.length) {
      runEffectImpl(e, cb)
    } else if (waitingCount() < capacity - 1) {
      effects.push(e)
    }
  }

  const runEffectImpl = <A>(e: T.Effect<R, E, A>, cb?: (a: A) => void) => {
    currentCancel = r.unsafeRunWith(e, (exit) => {
      currentCancel = undefined

      if (Exit.isSuccess(exit)) {
        cb?.(exit.value)
      } else if (!(Cause.isInterrupted(exit.cause) && aborted)) {
        onFail(exit.cause)
      }

      runNextEffect()
    })
  }

  const runNextEffect = () => {
    if (effectsOffset >= effects.length) {
      resetEffects()
      return
    }

    const next = effects[effectsOffset]
    effects[effectsOffset] = undefined as any
    effectsOffset++
    runEffectImpl(next)
  }

  return {
    runEffect,
    abort,
  } as const
}
