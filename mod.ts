import * as T from "@effect-ts/core/Effect";
import { EffectSource, Signal, Talkback } from "./types";
import * as CB from "callbag-basics";
import { AsyncCancel } from "@effect-ts/core/Effect";
import { flow } from "@effect-ts/core/Function";

export const fromEffect =
  <R, E, A>(fa: T.Effect<R, E, A>): EffectSource<R, E, A> =>
  (r) =>
  (_, sink) => {
    let aborted = false;
    let cancel: AsyncCancel<E, A>;

    sink(Signal.START, (signal) => {
      switch (signal) {
        case Signal.DATA:
          cancel ??= r.runCancel(fa, (e) => {
            if (aborted) return;

            if (e._tag === "Success") {
              sink(Signal.DATA, e.value);
              sink(Signal.END);
            } else if (e.cause._tag === "Fail") {
              sink(Signal.END, e.cause.value);
            } else {
              sink(Signal.END);
            }
          });
          break;

        case Signal.END:
          aborted = true;
          if (cancel) {
            r.run(cancel);
          }
          break;
      }
    });
  };

export const map =
  <R, E, A, B>(fab: (a: A) => B) =>
  (source: EffectSource<R, E, A>): EffectSource<R, E, B> =>
    flow(source, CB.map(fab) as any);

export const run = <R, E, A>(
  source: EffectSource<R, E, A>
): T.Effect<R, E, void> =>
  T.withRuntimeM<R, R, E, void>((r) =>
    T.effectAsyncInterrupt<unknown, E, void>((cb) => {
      let talkback: Talkback;
      source(r)(Signal.START, (...op) => {
        switch (op[0]) {
          case Signal.START:
            talkback = op[1];
            talkback(Signal.DATA);
            break;

          case Signal.DATA:
            talkback(Signal.DATA);
            break;

          case Signal.END:
            cb(op[1] ? T.fail(op[1]) : T.unit);
            break;
        }
      });

      return T.succeedWith(() => talkback(Signal.END));
    })
  );
