import { GoFishPlayerActionSchema, GoFishHostActionSchema, GoFishHostGameStateSchema, GoFishPublicGameStateSchema, GoFishPlayerHandStateSchema, GoFishPlayerActionOutcomeSchema, GoFishHostActionOutcomeSchema } from "../go-fish-types";
import { createJsonZodObjectDataEncoder } from "../../../../../bfg-engine/src/game-metadata/encoders";


export const GoFishHostGameStateEncoder = createJsonZodObjectDataEncoder(GoFishHostGameStateSchema);
export const GoFishPublicGameStateEncoder = createJsonZodObjectDataEncoder(GoFishPublicGameStateSchema);
export const GoFishPrivatePlayerKnowledgeEncoder = createJsonZodObjectDataEncoder(GoFishPlayerHandStateSchema);
export const GoFishPlayerActionEncoder = createJsonZodObjectDataEncoder(GoFishPlayerActionSchema);
export const GoFishHostActionEncoder = createJsonZodObjectDataEncoder(GoFishHostActionSchema);
export const GoFishPlayerActionOutcomeEncoder = createJsonZodObjectDataEncoder(GoFishPlayerActionOutcomeSchema);
export const GoFishHostActionOutcomeEncoder = createJsonZodObjectDataEncoder(GoFishHostActionOutcomeSchema);
