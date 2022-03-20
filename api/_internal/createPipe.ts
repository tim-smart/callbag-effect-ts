import { Signal, Sink, Source, Talkback } from "strict-callbag"

export interface Callbacks<A, EI, EO> {
  onStart: (talkback: Talkback<any>) => void
  onData: (talkback: Talkback<any>, data: A) => void
  onEnd: (talkback: Talkback<any>, err?: EI) => void

  onRequest: (talkback: Talkback<any>) => void
  onAbort: (err?: EO) => void
}

export const createPipe = <A, EI, EO = never>(
  source: Source<A, EI>,
  sink: Sink<any, EI, EO>,
  {
    onStart,
    onData,
    onEnd,

    onRequest,
    onAbort,
  }: Callbacks<A, EI, EO>,
) => {
  let started = false
  let aborted = false
  let talkback: Talkback<any>

  sink(Signal.START, (signal, err) => {
    if (signal === Signal.DATA) {
      if (!started) {
        started = true

        source(Signal.START, (signal, data) => {
          if (aborted) {
            if (signal === Signal.START) {
              data(Signal.END)
            }
            return
          }

          if (signal === Signal.START) {
            talkback = data
            onStart(talkback)
          } else if (signal === Signal.DATA) {
            onData(talkback, data)
          } else if (signal === Signal.END) {
            onEnd(talkback, data)
          }
        })
      } else if (talkback) {
        onRequest(talkback)
      }
    } else if (Signal.END) {
      talkback?.(Signal.END)
      aborted = true
      onAbort(err)
    }
  })
}
