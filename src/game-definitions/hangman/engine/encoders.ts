import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders"
import { HangmanGameStateSchema, HangmanHostActionSchema, HangmanPlayerActionSchema } from "./hangman-engine";


export const HangmanGameSpecificStateEncoder = createJsonZodObjectDataEncoder(HangmanGameStateSchema);
export const HangmanPlayerActionEncoder = createJsonZodObjectDataEncoder(HangmanPlayerActionSchema);
export const HangmanHostActionEncoder = createJsonZodObjectDataEncoder(HangmanHostActionSchema);
