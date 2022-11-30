import * as Q from "@effect/io/Queue"
import { EffectSource } from "../Source.js"
import { repeatEffectOption } from "./repeatEffectOption.js"

export const fromQueue = <A>(
  queue: Q.Dequeue<A>,
): EffectSource<never, never, A> => repeatEffectOption(Q.take(queue))
