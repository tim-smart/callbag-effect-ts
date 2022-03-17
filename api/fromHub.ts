import * as H from "@effect-ts/core/Effect/Hub"
import * as M from "@effect-ts/core/Effect/Managed"
import { pipe } from "@effect-ts/core/Function"
import { fromQueue } from "./fromQueue"
import { unwrapManaged } from "./unwrapManaged"

export const fromHub = <R, E, A>(hub: H.XHub<never, R, unknown, E, never, A>) =>
  pipe(H.subscribe(hub), M.map(fromQueue), unwrapManaged)
