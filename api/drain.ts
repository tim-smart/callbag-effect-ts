// ets_tracing: off
import { EffectSource, Signal } from "../types"

export const drain =
  <R, E>(fa: EffectSource<R, E, any>): EffectSource<R, E, never> =>
  (r) =>
  (_, sink) => {
    fa(r)(Signal.START, (signal, data) => {
      if (signal === Signal.DATA) return
      sink(signal, data as any)
    })
  }
