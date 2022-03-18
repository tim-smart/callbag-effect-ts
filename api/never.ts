import { Signal, Source } from "strict-callbag"
import { EffectSource } from "../types"

const noop = () => {}

const neverImpl: Source<never, never> = (_, sink) => sink(Signal.START, noop)

export const never: EffectSource<unknown, never, never> = (_) => neverImpl
