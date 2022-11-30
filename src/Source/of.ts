import * as CB from "strict-callbag-basics"
import { EffectSource } from "../Source.js"

export const of =
  <A>(...as: A[]): EffectSource<never, never, A> =>
  (_) =>
    CB.of(...as)
