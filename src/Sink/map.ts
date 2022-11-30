import * as CBS from "strict-callbag-basics/Sink"
import { EffectSink } from "../Sink.js"

export const map =
  <A, B>(f: (b: B) => A) =>
  <R, EI, EO>(self: EffectSink<R, EI, EO, A>): EffectSink<R, EI, EO, B> =>
  (r) =>
    CBS.map_(self(r), f)
