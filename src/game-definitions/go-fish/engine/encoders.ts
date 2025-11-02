import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders";
import { 
  GoFishGameStateSchema, 
  GoFishHostActionSchema, 
  GoFishPlayerActionSchema 
} from "./go-fish-engine";

export const GoFishGameSpecificStateEncoder = createJsonZodObjectDataEncoder(GoFishGameStateSchema);
export const GoFishPlayerActionEncoder = createJsonZodObjectDataEncoder(GoFishPlayerActionSchema);
export const GoFishHostActionEncoder = createJsonZodObjectDataEncoder(GoFishHostActionSchema);

