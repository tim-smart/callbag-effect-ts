import { EffectSource } from "../types"
import { fromIterable } from "./fromIterable"

export const of = <A>(value: A): EffectSource<unknown, never, A> =>
  fromIterable([value])
