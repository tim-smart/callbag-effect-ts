import * as CBS from "strict-callbag-basics/Sink"
import { EffectSink } from "../types"

export const map_ =
  <R, EI, EO, A, B>(
    self: EffectSink<R, EI, EO, A>,
    f: (b: B) => A,
  ): EffectSink<R, EI, EO, B> =>
  (r) =>
    CBS.map_(self(r), f)

export const map =
  <A, B>(f: (b: B) => A) =>
  <R, EI, EO>(self: EffectSink<R, EI, EO, A>) =>
    map_(self, f)
