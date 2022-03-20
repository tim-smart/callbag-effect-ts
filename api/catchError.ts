// ets_tracing: off
import { EffectSource, Signal, Talkback } from "../types"

export const catchError_ =
  <R, R1, E, E1, A, B>(
    self: EffectSource<R, E, A>,
    onError: (e: E) => EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E1, A | B> =>
  (r) =>
  (_, sink) => {
    let innerTalkback: Talkback<any>
    const talkback: Talkback<any> = (signal) => innerTalkback?.(signal)

    const replaceSource = (
      fa: EffectSource<R & R1, E | E1, A | B>,
      initial = false,
    ) => {
      fa(r)(Signal.START, (t, d) => {
        if (t === Signal.START) {
          innerTalkback = d

          if (initial) {
            sink(Signal.START, talkback)
          } else {
            talkback(Signal.DATA)
          }
        } else if (
          initial &&
          t === Signal.END &&
          d !== undefined &&
          d._tag === "Fail"
        ) {
          replaceSource(onError(d.value as E))
        } else {
          sink(t, d as any)
        }
      })
    }

    replaceSource(self, true)
  }

/**
 * @ets_data_first catchError_
 */
export const catchError =
  <R1, E, E1, B>(onError: (e: E) => EffectSource<R1, E1, B>) =>
  <R, A>(fa: EffectSource<R, E, A>) =>
    catchError_(fa, onError)
