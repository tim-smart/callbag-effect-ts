import * as T from "@effect/io/Effect"
import * as H from "@effect/io/Hub"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { fromQueue } from "./fromQueue.js"
import { unwrapScope } from "./unwrapScope.js"

export const fromHub = <A>(hub: H.Hub<A>): EffectSource<never, never, A> =>
  pipe(H.subscribe(hub), T.map(fromQueue), unwrapScope)
