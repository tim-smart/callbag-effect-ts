import { Signal, Talkback } from "strict-callbag"
import { EffectSink } from "../types"

export const noop: EffectSink<unknown, unknown, never, unknown> = (_) => {
  let talkback: Talkback

  return (signal, data) => {
    if (signal === Signal.START) {
      talkback = data
      talkback(Signal.DATA)
    } else if (signal === Signal.DATA) {
      talkback(Signal.DATA)
    }
  }
}
