import * as CBS from "strict-callbag-basics/Sink"
import { EffectSink } from "../types"

export const noop: EffectSink<unknown, unknown, never, unknown> = (_) =>
  CBS.noop()
