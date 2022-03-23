import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { runMain } from "@effect-ts/node/Runtime"
import * as CB from "../"
import { tag } from "@effect-ts/core/Has"

// Some services
type Error = { _tag: "Fail" }

const makeResource = () => ({
  closed: false,
  count: 0,
  getCount() {
    if (this.closed) throw new Error("getCount: closed!")
    return this.count++
  },
  close() {
    this.closed = true
  },
})

interface Resource extends ReturnType<typeof makeResource> {}
const Resource = tag<Resource>()
const LiveResource = L.fromFunction(Resource)(makeResource)

const makeLogger = () => ({
  log: (...args: any[]) => T.succeedWith(() => console.error(...args)),
})
interface Logger extends ReturnType<typeof makeLogger> {}
const Logger = tag<Logger>()
const LiveLogger = L.fromFunction(Logger)(makeLogger)
const log = (...args: any[]) => T.accessServiceM(Logger)((l) => l.log(...args))

// program
const program = pipe(
  T.accessService(Resource)((r) => r),
  M.makeExit((r) =>
    T.succeedWith(() => {
      r.close()
    }),
  ),
  M.map((r) =>
    CB.async<Error, number>((emit) => {
      emit.data(r.getCount())
      emit.data(r.getCount())
      setTimeout(() => emit.data(r.getCount()), 1000)
      setTimeout(() => emit.data(r.getCount()), 2000)
      setTimeout(() => emit.end(), 2000)
    }),
  ),
  CB.unwrapManaged,
  CB.chainPar((i) => CB.of(i + 10)),
  CB.merge(CB.of(20)),
  CB.tap((i) => log("got", i)),
  CB.drain,
  CB.tap((i) => log("got", i)),
  CB.runDrain,
)

pipe(
  program,
  T.provideSomeLayer(LiveResource),
  T.provideSomeLayer(LiveLogger),
  runMain,
)
