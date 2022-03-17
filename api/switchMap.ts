// ets_tracing: off
import { EffectSource, Signal, Talkback } from "../types"

export const switchMap_ =
  <R, R1, E, E1, A, B>(
    fa: EffectSource<R, E, A>,
    fab: (a: A) => EffectSource<R1, E1, B>,
  ): EffectSource<R & R1, E | E1, B> =>
  (r) =>
  (_, sink) => {
    let talkback: Talkback<any>
    let innerTalkback: Talkback<any> | undefined
    let waitingForData = false
    let sourceEnded = false

    fa(r)(Signal.START, (t, d) => {
      if (t === Signal.START) {
        talkback = (signal) => {
          if (innerTalkback) {
            if (signal === Signal.DATA) {
              waitingForData = true
            }

            innerTalkback(signal)
          } else {
            d(signal)
          }
        }

        sink(Signal.START, talkback)
      } else if (t === Signal.DATA) {
        if (innerTalkback) {
          innerTalkback(Signal.END)
          innerTalkback = undefined
        }

        fab(d)(r)(Signal.START, (innerSignal, innerData) => {
          if (innerSignal === Signal.START) {
            innerTalkback = innerData
            innerTalkback(Signal.DATA)
          } else if (innerSignal === Signal.DATA) {
            waitingForData = false
            sink(Signal.DATA, innerData)
          } else if (innerSignal === Signal.END) {
            innerTalkback = undefined

            if (sourceEnded) {
              sink(Signal.END, innerData)
            } else if (innerData) {
              talkback(Signal.END)
              sink(Signal.END, innerData)
            } else if (waitingForData) {
              waitingForData = false
              talkback(Signal.DATA)
            }
          }
        })
      } else if (t === Signal.END) {
        sourceEnded = true

        if (!innerTalkback || d) {
          sink(Signal.END, d)
        }
      }
    })
  }

/**
 * @ets_data_first switchMap_
 */
export const switchMap =
  <R1, E1, A, B>(fab: (a: A) => EffectSource<R1, E1, B>) =>
  <R, E>(fa: EffectSource<R, E, A>): EffectSource<R & R1, E | E1, B> =>
    switchMap_(fa, fab)
