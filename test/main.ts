import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
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

const makeResource = () => ({
  closed: false,
  count: 0,
  getCount() {
    return this.count++
  },
  close() {
    console.error("close")
    this.closed = true
  },
})

const managedStream = pipe(
  T.succeedWith(makeResource),
  M.makeExit((r) =>
    T.succeedWith(() => {
      r.close()
    }),
  ),
  M.map((r) =>
    CB.async<unknown, Error, number>((emit) => {
      console.error("async")
      emit.single(r.getCount())
      emit.single(r.getCount())
      setTimeout(() => emit.single(r.getCount()), 1000)
      setTimeout(() => emit.single(r.getCount()), 2000)
      setTimeout(() => emit.end(), 2000)
    }),
  ),
  CB.unwrapManaged,
  CB.tap(console.error),
  CB.run,
)

pipe(managedStream, runMain)
