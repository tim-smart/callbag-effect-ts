import * as CB from "strict-callbag-basics"
import { EffectSource } from "../types"

export const empty: EffectSource<unknown, never, never> = () => CB.empty
