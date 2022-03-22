import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const share = <R, E, A>(
  self: EffectSource<R, E, A>,
): EffectSource<R, E, A> => {
  const cache = new Map<any, any>()

  return (r) => {
    const value = cache.get(r.env)
    if (value) return value

    const source = CB.share(self(r))
    cache.set(r.env, source)
    return source
  }
}
