import * as T from "@effect/io/Effect"
import * as L from "@effect/io/Layer"
import { Tag } from "@fp-ts/data/Context"
import { pipe } from "strict-callbag-basics"
import * as CB from "../"

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
const Resource = Tag<Resource>()
const LiveResource = L.sync(Resource)(makeResource)

const makeLogger = () => ({
  log: (...args: any[]) => T.sync(() => console.error(...args)),
})
interface Logger extends ReturnType<typeof makeLogger> {}
const Logger = Tag<Logger>()
const LiveLogger = L.sync(Logger)(makeLogger)
const log = (...args: any[]) =>
  T.serviceWithEffect(Logger)((l) => l.log(...args))

// program
const program = pipe(
  T.acquireRelease(pipe(T.serviceWith(Resource)((r) => r)), (r) =>
    T.sync(() => {
      console.error("CLOSE")
      r.close()
    }),
  ),
  T.map((r) =>
    CB.async<Error, number>((emit) => {
      emit.data(r.getCount())
      emit.data(r.getCount())
      setTimeout(() => emit.data(r.getCount()), 1000)
      setTimeout(() => emit.data(r.getCount()), 2000)
      setTimeout(() => emit.end(), 2000)
    }),
  ),
  CB.unwrap,
  CB.chainPar((i) => CB.of(i + 10)),
  CB.merge(CB.of(20)),
  CB.tap((i) => log("got", i)),
  CB.drain,
  CB.tap((i) => log("got", i)),
  CB.runDrain,
)

pipe(
  program,
  T.scoped,
  T.provideSomeLayer(LiveResource),
  T.provideSomeLayer(LiveLogger),
  T.unsafeRunPromise,
).catch(console.error)
