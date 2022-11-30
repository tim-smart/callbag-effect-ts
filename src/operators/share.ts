import { Cause } from "@effect/io/Cause"
import * as T from "@effect/io/Effect"
import * as Scope from "@effect/io/Scope"
import * as CB from "strict-callbag-basics"
import { pipe } from "callbag-effect-ts/Source"
import { EffectSource } from "../Source.js"
import { unwrap } from "./unwrap.js"

export const share = <R, E, A>(self: EffectSource<R, E, A>) => {
  const cache = new Map<Scope.Scope, CB.Source<A, Cause<E>>>()

  const make = pipe(
    T.struct({
      runtime: T.runtime<R>(),
      scope: T.service(Scope.Tag),
    }),
    T.map(({ runtime, scope }) => {
      if (cache.has(scope)) {
        return cache.get(scope)!
      }
      const source = CB.share(self(runtime))
      cache.set(scope, source)
      return source
    }),
    T.map(
      (source): EffectSource<R, E, A> =>
        (_) =>
          source,
    ),
  )

  return unwrap(make)
}
