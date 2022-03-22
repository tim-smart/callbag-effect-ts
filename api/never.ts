import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const never: EffectSource<unknown, never, never> = (_) => CB.never
