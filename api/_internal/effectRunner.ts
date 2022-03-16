import * as T from "@effect-ts/core/Effect"
import { CustomRuntime } from "@effect-ts/core/Effect"
import * as Cause from "@effect-ts/core/Effect/Cause"

export const make = <R, E>(
  r: CustomRuntime<R, unknown>,
  onFail: (cause: Cause.Cause<E>) => void,
) => {
  let effects: T.Effect<R, E, any>[] = []
  let effectsOffset = 0
  let currentCancel: T.AsyncCancel<E, any> | undefined = undefined

  let aborted = false

  const abort = (cleanup?: T.UIO<void>) => {
    if (aborted) return

    effects = []
    effectsOffset = 0

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
    } else {
      effects.push(e)
    }
  }

  const runEffectImpl = (e: T.Effect<R, E, any>) => {
    currentCancel = r.runCancel(e, (exit) => {
      currentCancel = undefined

      if (exit._tag === "Failure" && exit.cause._tag !== "Interrupt") {
        onFail(exit.cause)
      }

      runNextEffect()
    })
  }

  const runNextEffect = () => {
    if (effectsOffset >= effects.length) {
      if (effectsOffset > 0) {
        effects = []
        effectsOffset = 0
      }
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
