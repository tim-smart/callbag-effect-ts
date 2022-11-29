import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const never: EffectSource<never, never, never> = (_) => CB.never
