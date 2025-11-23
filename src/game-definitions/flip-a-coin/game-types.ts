import z from "zod";
import { BfgGameActionByHostSchema, BfgGameActionByPlayerSchema, BfgGameEventOutcomeSchema, BfgGameHostActionOutcomeSchema, BfgGamePlayerActionOutcomeSchema } from "../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";
import { GameTableSeatSchema } from "../../../../bfg-engine/src/models/internal/game-room-base";
import { BfgGameStateForHostSchema } from "../../../../bfg-engine/src/game-metadata/metadata-types/game-state-types";


export const FlipACoinResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-heads-wins',
  'game-over-tails-wins',
])

export type FlipACoinResolution = z.infer<typeof FlipACoinResolutionSchema>;


export const FlipACoinResultSchema = z.enum([
  'heads',
  'tails',
])

export type FlipACoinResult = z.infer<typeof FlipACoinResultSchema>;


export const FlipACoinPlayerFlipResultPreferenceSchema = z.enum([
  'heads',
  'tails',
  'no-preference',
])

export type FlipACoinPlayerFlipResultPreference = z.infer<typeof FlipACoinPlayerFlipResultPreferenceSchema>;


export const CoinChoiceSchema = z.enum([
  'penny',
  'nickel',
  'dime',
  'quarter',
])

export type CoinChoice = z.infer<typeof CoinChoiceSchema>;


export const FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME = 'game-table-action-host-starts-game' as const;
export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN = 'game-table-action-player-choose-coin' as const;
export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN = 'game-table-action-player-flip-coin' as const;
export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT = 'game-table-action-player-prefer-flip-result' as const;
export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME = 'game-table-action-player-call-it-and-finish-game' as const;
export const FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME = 'game-table-action-player-cancel-game' as const;


export const FlipACoinStartGameSchema = BfgGameActionByHostSchema.extend({
  hostActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME),
  activePlayerSeats: z.array(GameTableSeatSchema),
})

export type FlipACoinStartGame = z.infer<typeof FlipACoinStartGameSchema>;


export const FlipACoinActionChooseCoinSchema = BfgGameActionByPlayerSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN),
  chosenCoin: CoinChoiceSchema,
})

export const FlipACoinActionFlipCoinSchema = BfgGameActionByPlayerSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN),
  flipResult: FlipACoinResultSchema,
})

export const FlipACoinActionPreferOutcomeSchema = BfgGameActionByPlayerSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT),
  preferredFlipResult: FlipACoinPlayerFlipResultPreferenceSchema,
})

export const FlipACoinActionCallItAndFinishGameSchema = BfgGameActionByPlayerSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME),
  calledFlipResult: FlipACoinResultSchema,
})

export const FlipACoinActionCancelGameSchema = BfgGameActionByPlayerSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME),
  cancellationReason: z.string(),
})

export const FlipACoinPlayerActionSchema = z.discriminatedUnion('playerActionType', [
  FlipACoinActionChooseCoinSchema, 
  FlipACoinActionFlipCoinSchema,
  FlipACoinActionPreferOutcomeSchema,
  FlipACoinActionCallItAndFinishGameSchema,
  FlipACoinActionCancelGameSchema,
])

export type FlipACoinPlayerAction = z.infer<typeof FlipACoinPlayerActionSchema>;


export const FlipACoinHostActionSchema = z.discriminatedUnion('hostActionType', [
  FlipACoinStartGameSchema,
])

export type FlipACoinHostAction = z.infer<typeof FlipACoinHostActionSchema>;

export const AllFlipACoinGameEventsSchema = [
  FlipACoinStartGameSchema,
  FlipACoinActionChooseCoinSchema,
  FlipACoinActionFlipCoinSchema,
  FlipACoinActionPreferOutcomeSchema,
  FlipACoinActionCallItAndFinishGameSchema,
  FlipACoinActionCancelGameSchema,
] as const;
export type AllFlipACoinGameEvents = z.infer<typeof AllFlipACoinGameEventsSchema>;

export const FlipACoinGameEventSchema = z.union([
  FlipACoinStartGameSchema,
  FlipACoinActionChooseCoinSchema,
  FlipACoinActionFlipCoinSchema,
  FlipACoinActionPreferOutcomeSchema,
  FlipACoinActionCallItAndFinishGameSchema,
  FlipACoinActionCancelGameSchema,
]);
export type FlipACoinGameEvent = z.infer<typeof FlipACoinGameEventSchema>;


export const FlipACoinGameStateSchema = BfgGameStateForHostSchema.extend({
  chosenCoin: CoinChoiceSchema,
  
  isGameOver: z.boolean(),
  finalFlipResult: FlipACoinResultSchema.optional(),
  outcomeSummary: z.string().optional(),

  isFlipped: z.boolean(),
  flipResult: FlipACoinResultSchema.optional(),  
  
  playerFlipResultPreferences: z.array(z.object({
    seat: GameTableSeatSchema,
    preference: FlipACoinPlayerFlipResultPreferenceSchema,
  })),
}).describe('Flip A Coin');

export type FlipACoinGameState = z.infer<typeof FlipACoinGameStateSchema>;


export const FlipACoinPlayerActionOutcomeSchema = BfgGamePlayerActionOutcomeSchema;
export type FlipACoinPlayerActionOutcome = z.infer<typeof FlipACoinPlayerActionOutcomeSchema>;

export const FlipACoinHostActionOutcomeSchema = BfgGameHostActionOutcomeSchema;
export type FlipACoinHostActionOutcome = z.infer<typeof FlipACoinHostActionOutcomeSchema>;

export const FlipACoinGameEventOutcomeSchema = BfgGameEventOutcomeSchema.extend({}).describe('FlipACoinGameEventOutcome');
export type FlipACoinGameEventOutcome = z.infer<typeof FlipACoinGameEventOutcomeSchema>;
