import { createJsonZodObjectDataEncoder } from "../../../../../bfg-engine/src/game-metadata/encoders";
import type { IBfgEngineMetadataEncoders } from "../../../../../bfg-engine/src/game-metadata/metadata-types";
import { RockPaperScissorsHostGameStateSchema, RockPaperScissorsPlayerGameStateSchema, RockPaperScissorsWatcherGameStateSchema, RockPaperScissorsPlayerActionSchema, RockPaperScissorsHostActionSchema, RockPaperScissorsPlayerActionsUnionSchema } from "../rock-paper-scissors-types";


export const RockPaperScissorsGameEncoders: IBfgEngineMetadataEncoders<
  typeof RockPaperScissorsHostGameStateSchema,
  typeof RockPaperScissorsPlayerGameStateSchema,
  typeof RockPaperScissorsWatcherGameStateSchema,
  typeof RockPaperScissorsPlayerActionSchema,
  typeof RockPaperScissorsHostActionSchema,
  typeof RockPaperScissorsPlayerActionsUnionSchema
> = {
  hostGameStateEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsHostGameStateSchema),
  playerGameStateEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsPlayerGameStateSchema),
  watcherGameStateEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsWatcherGameStateSchema),
  playerActionEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsPlayerActionSchema),
  hostActionEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsHostActionSchema),
  playerActionsUnionEncoder: createJsonZodObjectDataEncoder(RockPaperScissorsPlayerActionsUnionSchema),
  // playerActionsEncoder: createJsonZodObjectDataEncoder(AllRockPaperScissorsPlayerActionSchemas),
};