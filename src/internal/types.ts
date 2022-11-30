import { unsafeRunWith } from "@effect/io/Effect"

export type AsyncCancel = ReturnType<typeof unsafeRunWith>
