// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { EffectSource } from "../types"
import { fromEffect } from "./fromEffect"

export const fromManaged = <R, E, A>(
  fa: M.Managed<R, E, A>,
): EffectSource<R, E, A> => fromEffect(M.use_(fa, T.succeed))
