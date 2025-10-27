import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders"
import { FlipACoinGameStateSchema, FlipACoinHostActionSchema, FlipACoinPlayerActionSchema } from "./flip-a-coin-engine";


export const FlipACoinGameSpecificStateEncoder = createJsonZodObjectDataEncoder(FlipACoinGameStateSchema);
export const FlipACoinPlayerActionEncoder = createJsonZodObjectDataEncoder(FlipACoinPlayerActionSchema);
export const FlipACoinHostActionEncoder = createJsonZodObjectDataEncoder(FlipACoinHostActionSchema);
