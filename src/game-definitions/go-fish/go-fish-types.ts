import z from "zod";
import { GameTableSeatSchema } from "@bfg-engine";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema, BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BfgGameSpecificGameStateSchema } from "@bfg-engine/models/game-table/game-table-action";
import { PlayingCardSchema, CardRankSchema } from "./engine/engine-utils";


// Game resolution states
export const GoFishResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-with-winner',
]);

export type GoFishResolution = z.infer<typeof GoFishResolutionSchema>;

// Action type constants
export const GO_FISH_HOST_ACTION_STARTS_GAME = 'game-table-action-host-starts-game' as const;
export const GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS = 'game-table-action-player-ask-for-cards' as const;
export const GO_FISH_PLAYER_ACTION_DRAW_CARD = 'game-table-action-player-draw-card' as const;

// Host action to start the game
export const GoFishStartGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(GO_FISH_HOST_ACTION_STARTS_GAME),
  shuffledDeck: z.array(PlayingCardSchema),
  initialHandSize: z.number(),
});

export type GoFishStartGame = z.infer<typeof GoFishStartGameSchema>;

// Player action to ask another player for cards
export const GoFishPlayerAskForCardsSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS),
  playerSeat: GameTableSeatSchema,
  targetPlayerSeat: GameTableSeatSchema,
  requestedRank: CardRankSchema,
});

export type GoFishPlayerAskForCards = z.infer<typeof GoFishPlayerAskForCardsSchema>;

// Player action to draw a card from the deck
export const GoFishPlayerDrawCardSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(GO_FISH_PLAYER_ACTION_DRAW_CARD),
  playerSeat: GameTableSeatSchema,
});

export type GoFishPlayerDrawCard = z.infer<typeof GoFishPlayerDrawCardSchema>;

// Union of all player actions
export const GoFishPlayerActionSchema = z.discriminatedUnion('playerActionType', [
  GoFishPlayerAskForCardsSchema,
  GoFishPlayerDrawCardSchema,
]);

export type GoFishPlayerAction = z.infer<typeof GoFishPlayerActionSchema>;

// Union of all host actions
export const GoFishHostActionSchema = z.discriminatedUnion('hostActionType', [
  GoFishStartGameSchema,
]);

export type GoFishHostAction = z.infer<typeof GoFishHostActionSchema>;

// Player state in the game
export const GoFishPlayerHandStateSchema = BfgPrivatePlayerKnowledgeImplStateSchema.extend({
  hand: z.array(PlayingCardSchema),
  // completedSets: z.array(CardRankSchema),
  // score: z.number(),
});

export type GoFishPlayerHandState = z.infer<typeof GoFishPlayerHandStateSchema>;

export const GoFishPlayerBoardStateSchema = z.object({
  completedSets: z.array(CardRankSchema),
  handSize: z.number(),
  score: z.number(),
});

export type GoFishPlayerBoardState = z.infer<typeof GoFishPlayerBoardStateSchema>;



// Main game state
export const GoFishPublicGameStateSchema = BfgGameSpecificGameStateSchema.extend({
  // deck: z.array(PlayingCardSchema),
  deckCount: z.number(),
  playerBoardStates: z.record(GameTableSeatSchema, GoFishPlayerBoardStateSchema),
  currentPlayerSeat: GameTableSeatSchema,
  lastAction: z.string().optional(),
  resolution: GoFishResolutionSchema,
  isGameOver: z.boolean(),
  winningSeats: z.array(GameTableSeatSchema),
});

export type GoFishPublicGameState = z.infer<typeof GoFishPublicGameStateSchema>;

// Main game state
export const GoFishHostGameStateSchema = GoFishPublicGameStateSchema.extend({
  deck: z.array(PlayingCardSchema),
  playerHandStates: z.record(GameTableSeatSchema, GoFishPlayerHandStateSchema),
  // currentPlayerSeat: GameTableSeatSchema,
  // lastAction: z.string().optional(),
  // resolution: GoFishResolutionSchema,
  // isGameOver: z.boolean(),
  // winningSeat: GameTableSeatSchema.optional(),
});

export type GoFishHostGameState = z.infer<typeof GoFishHostGameStateSchema>;
