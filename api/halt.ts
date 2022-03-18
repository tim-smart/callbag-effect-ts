import { Cause } from "@effect-ts/core/Effect/Cause"
import { EffectSource } from "../types"
import { halt as haltImpl } from "./_internal/halt"

export const halt =
  <E>(c: Cause<E>): EffectSource<unknown, E, never> =>
  () =>
    haltImpl(c)
