// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import { CustomRuntime } from "@effect-ts/core/Effect"
import * as Cause from "@effect-ts/core/Effect/Cause"

export const make = <R, E>(
  r: CustomRuntime<R, unknown>,
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

  let currentCancel: T.AsyncCancel<E, any> | undefined = undefined

  let aborted = false

  const abort = (cleanup?: T.UIO<void>) => {
    if (aborted) return

    resetEffects()

    if (currentCancel) {
      r.run(currentCancel)
    }

    if (cleanup) {
      runEffect(cleanup)
    }

    aborted = true
  }

  const runEffect = (e: T.Effect<R, E, any>) => {
    if (aborted) return

    if (!currentCancel && !effects.length) {
      runEffectImpl(e)
    } else if (waitingCount() < capacity - 1) {
      effects.push(e)
    }
  }

  const runEffectImpl = (e: T.Effect<R, E, any>) => {
    currentCancel = r.runCancel(e, (exit) => {
      currentCancel = undefined

      if (
        exit._tag === "Failure" &&
        !(exit.cause._tag === "Interrupt" && aborted)
      ) {
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
