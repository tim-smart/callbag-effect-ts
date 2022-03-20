declare module "callbag-start-with" {
  import { Source } from "strict-callbag"

  type StartWith = <A>(...as: A[]) => <E>(source: Source<A, E>) => Source<A, E>
  const startWith: StartWith

  export default startWith
}
