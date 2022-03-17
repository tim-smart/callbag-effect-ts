import { EffectSource, Signal, Talkback } from "../types"

export const catchError_ =
  <R, E, A>(onError: (e: E) => EffectSource<R, E, A>) =>
  (fa: EffectSource<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let innerTalkback: Talkback
    const talkback: Talkback = (signal) => innerTalkback?.(signal)

    const replaceSource = (fa: EffectSource<R, E, A>, initial = false) => {
      fa(r)(Signal.START, (t, d) => {
        if (t === Signal.START) {
          innerTalkback = d

          if (initial) {
            sink(Signal.START, talkback)
          } else {
            talkback(Signal.DATA)
          }
        } else if (t === Signal.END && d !== undefined && d._tag === "Fail") {
          replaceSource(onError(d.value))
        } else {
          sink(t as any, d as any)
        }
      })
    }

    replaceSource(fa, true)
  }
