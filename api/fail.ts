import * as C from "@effect-ts/core/Effect/Cause"
import { halt } from "./halt"

export const fail = <E>(e: E) => halt(C.fail(e))
