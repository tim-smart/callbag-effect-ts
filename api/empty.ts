import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const empty: EffectSource<never, never, never> = () => CB.empty
