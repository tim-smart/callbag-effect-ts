import cbShare from "callbag-share"
import { EffectSource } from "../types"

export const share = <R, E, A>(
  self: EffectSource<R, E, A>,
): EffectSource<R, E, A> => {
  const cache = new Map<any, any>()

  return (r) => {
    const value = cache.get(r)
    if (value) return value

    const source = cbShare(self(r) as any)
    cache.set(r, source)
    return source
  }
}
