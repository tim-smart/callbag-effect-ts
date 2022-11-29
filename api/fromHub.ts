import * as T from "@effect/io/Effect"
import * as H from "@effect/io/Hub"
import { pipe } from "strict-callbag-basics"
import { fromQueue } from "./fromQueue"
import { unwrap } from "./unwrap"

export const fromHub = <A>(hub: H.Hub<A>) =>
  pipe(
    H.subscribe(hub),
    T.map((a) => fromQueue(a)),
    unwrap,
  )
