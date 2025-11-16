import z from "zod";
import { GameTableSeatSchema } from "@bfg-engine";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema, BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BfgGameSpecificGameStateSchema } from "@bfg-engine/models/game-table/game-table-action";
import { PlayingCardSchema, CardRankSchema } from "@bfg-engine/game-stock/std-card-games/types";


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

export const GO_FISH_PLAYER_ACTION_OUTCOME_RECEIVED_CARDS = 'received-cards' as const;
export const GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD = 'draw-card' as const;
export const GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL = 'terminal-player-action' as const;

export const GO_FISH_HOST_ACTION_OUTCOME_STARTS_GAME = 'shuffles-and-deals-cards' as const;
export const GO_FISH_HOST_ACTION_OUTCOME_TERMINAL = 'terminal-host-action' as const;


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

export const GoFishPlayerActionOutcomeReceivedCardsSchema = z.object({
  playerActionOutcomeType: z.literal(GO_FISH_PLAYER_ACTION_OUTCOME_RECEIVED_CARDS),
  receivedCards: z.array(PlayingCardSchema),
});

export const GoFishPlayerActionOutcomeDrawCardSchema = z.object({
  playerActionOutcomeType: z.literal(GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD),
  drawnCard: PlayingCardSchema,
  fishMyWish: z.boolean(),
});

export const GoFishPlayerActionOutcomeTerminalMessageSchema = z.object({
  playerActionOutcomeType: z.literal(GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL),
  terminalMessage: z.string(),
});

export const GoFishPlayerActionOutcomeSchema = z.discriminatedUnion('playerActionOutcomeType', [
  GoFishPlayerActionOutcomeReceivedCardsSchema,
  GoFishPlayerActionOutcomeDrawCardSchema,
  GoFishPlayerActionOutcomeTerminalMessageSchema,
]);
export type GoFishPlayerActionOutcome = z.infer<typeof GoFishPlayerActionOutcomeSchema>;

// Union of all host actions
export const GoFishHostActionSchema = z.discriminatedUnion('hostActionType', [
  GoFishStartGameSchema,
]);

export type GoFishHostAction = z.infer<typeof GoFishHostActionSchema>;

export const GoFishHostActionOutcomeStartGameSchema = z.object({
  hostActionOutcomeType: z.literal(GO_FISH_HOST_ACTION_OUTCOME_STARTS_GAME),
  shuffledDeck: z.array(PlayingCardSchema),
  initialHandSize: z.number(),
});

export type GoFishHostActionOutcomeStartGame = z.infer<typeof GoFishHostActionOutcomeStartGameSchema>;


export const GoFishHostActionOutcomeTerminalMessageSchema = z.object({
  hostActionOutcomeType: z.literal(GO_FISH_HOST_ACTION_OUTCOME_TERMINAL),
  terminalMessage: z.string(),
});

export const GoFishHostActionOutcomeSchema = z.discriminatedUnion('hostActionOutcomeType', [
  GoFishHostActionOutcomeStartGameSchema,
  GoFishHostActionOutcomeTerminalMessageSchema,
]);

export type GoFishHostActionOutcome = z.infer<typeof GoFishHostActionOutcomeSchema>;


export const GoFishPlayerHandStateSchema = BfgPrivatePlayerKnowledgeImplStateSchema.extend({
  hand: z.array(PlayingCardSchema),
}).describe('GoFishPlayerHandState');

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
}).describe('GoFishPublicGameState');

export type GoFishPublicGameState = z.infer<typeof GoFishPublicGameStateSchema>;


// Main game state
export const GoFishHostGameStateSchema = GoFishPublicGameStateSchema.extend({
  deck: z.array(PlayingCardSchema),
  playerHandStates: z.record(GameTableSeatSchema, GoFishPlayerHandStateSchema),
}).describe('GoFishHostGameState');

export type GoFishHostGameState = z.infer<typeof GoFishHostGameStateSchema>;
