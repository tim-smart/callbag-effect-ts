// ets_tracing: off
import * as T from "@effect-ts/core/Effect"
import * as CS from "@effect-ts/core/Effect/Cause"
import * as Q from "@effect-ts/core/Effect/Queue"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import { EffectSource } from "../types"
import { repeatEffectOption } from "./repeatEffectOption"

export const fromQueue = <R, E, A>(
  queue: Q.XDequeue<R, E, A>,
): EffectSource<R, E, A> =>
  repeatEffectOption(
    pipe(
      Q.take(queue),
      T.catchAllCause((c) =>
        T.chain_(Q.isShutdown(queue), (down) => {
          if (down && CS.interrupted(c)) {
            return T.fail(O.none)
          }
          return T.mapError_(T.halt(c), O.some)
        }),
      ),
    ),
  )
