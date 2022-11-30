import * as CBS from "strict-callbag-basics/Sink"
import { EffectSink } from "../Sink.js"

export const noop: EffectSink<never, unknown, never, unknown> = (_) =>
  CBS.noop()
