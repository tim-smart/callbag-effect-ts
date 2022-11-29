import * as Q from "@effect/io/Queue"
import { EffectSource } from "../types"
import { repeatEffectOption } from "./repeatEffectOption"

export const fromQueue = <A>(
  queue: Q.Dequeue<A>,
): EffectSource<never, never, A> => repeatEffectOption(Q.take(queue))
