import { EffectSource } from "../Source.js"
import * as CB from "strict-callbag-basics"

export const overridePull = <R, E, A>(
  self: EffectSource<R, E, A>,
  initialPulls = 1,
): readonly [source: EffectSource<R, E, A>, pull: () => void] => {
  const pulls = new Set<() => void>()

  const source: EffectSource<R, E, A> = (r) => {
    const [s, pull] = CB.overridePull(self(r), initialPulls)
    pulls.add(pull)
    return s
  }

  return [source, () => pulls.forEach((f) => f())]
}
