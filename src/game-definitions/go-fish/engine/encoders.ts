import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders";
import { GoFishPlayerActionSchema, GoFishHostActionSchema, GoFishHostGameStateSchema, GoFishPublicGameStateSchema, GoFishPlayerHandStateSchema } from "../go-fish-types";


export const GoFishHostGameStateEncoder = createJsonZodObjectDataEncoder(GoFishHostGameStateSchema);
export const GoFishPublicGameStateEncoder = createJsonZodObjectDataEncoder(GoFishPublicGameStateSchema);
export const GoFishPrivatePlayerKnowledgeEncoder = createJsonZodObjectDataEncoder(GoFishPlayerHandStateSchema);
export const GoFishPlayerActionEncoder = createJsonZodObjectDataEncoder(GoFishPlayerActionSchema);
export const GoFishHostActionEncoder = createJsonZodObjectDataEncoder(GoFishHostActionSchema);
