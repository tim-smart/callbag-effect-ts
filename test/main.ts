import { pipe } from "@effect-ts/core/Function"
import * as C from "@effect-ts/core/Collections/Immutable/Chunk"
import { runMain } from "@effect-ts/node/Runtime"
import * as CB from "../mod"

type Error = { _tag: "Fail" }

const stream = pipe(
  CB.async<unknown, Error, number>((emit) => {
    emit.single(1)
    emit.chunk(C.make(2, 3))
    emit.end()
  }),
  CB.tap(console.error),
  CB.run,
)

pipe(stream, runMain)
