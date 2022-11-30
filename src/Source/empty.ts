import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const empty: EffectSource<never, never, never> = () => CB.empty
