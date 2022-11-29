import * as CBS from "strict-callbag-basics/Sink"
import { EffectSink } from "../types"

export const noop: EffectSink<never, unknown, never, unknown> = (_) =>
  CBS.noop()
