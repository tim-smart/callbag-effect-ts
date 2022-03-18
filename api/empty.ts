import { EffectSource } from "../types"
import { halt } from "./_internal/halt"

const emptyImpl = halt<never>(undefined as never)

export const empty: EffectSource<unknown, never, never> = () => emptyImpl
