import { EffectSource } from "../types"
import cbShare from "callbag-share"

export const share =
  <R, E, A>(self: EffectSource<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
    cbShare(self(r) as any) as any
