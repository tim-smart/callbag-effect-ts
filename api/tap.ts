import { EffectSource } from "../types"
import { map_ } from "./map"

export const tap_ = <R, E, A>(self: EffectSource<R, E, A>, f: (a: A) => any) =>
  map_(self, (a) => {
    f(a)
    return a
  })

export const tap =
  <R, E, A>(f: (a: A) => any) =>
  (self: EffectSource<R, E, A>) =>
    tap_(self, f)
