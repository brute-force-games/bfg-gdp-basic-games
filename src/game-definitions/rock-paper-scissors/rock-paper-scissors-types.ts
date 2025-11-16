import { z } from "zod";
import { BfgGameStateForHostSchema, BfgGameStateForPlayerSchema, BfgGameStateForWatcherSchema } from "../../../../bfg-engine/src/game-metadata/metadata-types/game-state-types";
import {
  RockPaperScissorsPlayerShowingSchema,
  RockPaperScissorsPlayerChoiceSchema,
} from "./engine/action-types";
import { RockPaperScissorsHostActionStartGameSchema, RockPaperScissorsHostActionCallRoundWinnerSchema, RockPaperScissorsHostActionCallGameWinnerSchema } from "./engine/host-actions";
import { RockPaperScissorsPlayerActionSetHandSchema, RockPaperScissorsPlayerActionConcedeSchema } from "./engine/player-actions";
import {
  BfgGameActionByHostSchema,
  BfgGameActionByPlayerSchema,
  BfgGameSpecificHostActionOutcomeSchema,
  BfgGameSpecificPlayerActionOutcomeSchema,
} from "../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";


// Game resolution states
export const RockPaperScissorsResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-with-winner',
]);

export type RockPaperScissorsResolution = z.infer<typeof RockPaperScissorsResolutionSchema>;

// // Action type constants
// export const ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME = 'game-table-action-host-start-game' as const;
// // export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_MAKE_CHOICE = 'game-table-action-player-make-choice' as const;

// export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND = 'player-action-set-hand' as const;
// // export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_OUTCOME_TERMINAL = 'terminal-player-action' as const;

// export const ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER = 'host-action-call-round-winner' as const;
// export const ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER = 'host-action-call-game-winner' as const;
// // export const ROCK_PAPER_SCISSORS_HOST_ACTION_OUTCOME_TERMINAL = 'terminal-host-action' as const;

// export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE = 'player-action-concede' as const;

// export const RockPaperScissorsPlayerChoiceSchema = z.enum([
//   'rock',
//   'paper',
//   'scissors',
// ]);
// export type RockPaperScissorsPlayerChoice = z.infer<typeof RockPaperScissorsPlayerChoiceSchema>;

// export const RockPaperScissorsPlayerShowingSchema = z.union([
//   RockPaperScissorsPlayerChoiceSchema,
//   z.enum(['hidden']),
// ]).describe('RockPaperScissorsPlayerShowing');
// export type RockPaperScissorsPlayerShowing = z.infer<typeof RockPaperScissorsPlayerShowingSchema>;


// // Host action to start the game
// export const RockPaperScissorsStartGameSchema = BfgGameImplHostActionSchema.extend({
//   actionType: z.literal(ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME),
// });

// export type RockPaperScissorsStartGame = z.infer<typeof RockPaperScissorsStartGameSchema>;

// // Player action to ask another player for cards
// export const RockPaperScissorsPlayerActionSetHandSchema = BfgGameActionByPlayerSchema.extend({
//   actionType: z.literal(ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND),
//   playerSeat: GameTableSeatSchema,
//   choice: RockPaperScissorsPlayerChoiceSchema,
// });

// export type RockPaperScissorsPlayerActionSetHand = z.infer<typeof RockPaperScissorsPlayerActionSetHandSchema>;


// export const RockPaperScissorsPlayerActionConcedeSchema = BfgGameActionByPlayerSchema.extend({
//   actionType: z.literal(ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE),
// });

// export type RockPaperScissorsPlayerActionConcede = z.infer<typeof RockPaperScissorsPlayerActionConcedeSchema>;

// export const AllRockPaperScissorsPlayerActionsSchema = z.array(
//   z.union([
//     RockPaperScissorsPlayerActionSetHandSchema,
//     RockPaperScissorsPlayerActionConcedeSchema,
//   ])
// );
// export type AllRockPaperScissorsPlayerActions = z.infer<typeof AllRockPaperScissorsPlayerActionsSchema>;

// export const AllRockPaperScissorsHostActionsSchema = z.array(
//   z.union([
//     RockPaperScissorsStartGameSchema,
//     RockPaperScissorsHostActionCallRoundWinnerSchema,
//     RockPaperScissorsHostActionCallGameWinnerSchema,
//   ])
// );
// export type AllRockPaperScissorsHostActions = z.infer<typeof AllRockPaperScissorsHostActionsSchema>;

export const AllRockPaperScissorsPlayerActionSchemas = [
  RockPaperScissorsPlayerActionSetHandSchema,
  RockPaperScissorsPlayerActionConcedeSchema,
] as const;
export type AllRockPaperScissorsPlayerActionSchemas = typeof AllRockPaperScissorsPlayerActionSchemas;

export const RockPaperScissorsPlayerActionsUnionSchema = z.discriminatedUnion(
  'actionType',
  AllRockPaperScissorsPlayerActionSchemas,
);
export type RockPaperScissorsPlayerActionsUnionSchemaType = typeof RockPaperScissorsPlayerActionsUnionSchema;
export type RockPaperScissorsPlayerActionsUnion = z.infer<typeof RockPaperScissorsPlayerActionsUnionSchema>;

// Union of all player actions
export const RockPaperScissorsPlayerActionSchema = BfgGameActionByPlayerSchema.extend({
  // Optional because concede does not include a choice. The action-specific schema
  // `RockPaperScissorsPlayerActionSetHandSchema` keeps the stricter requirement.
  choice: RockPaperScissorsPlayerChoiceSchema.optional(),
}).describe('RockPaperScissorsPlayerAction');

export type RockPaperScissorsPlayerAction = z.infer<typeof RockPaperScissorsPlayerActionSchema>;

export const AllRockPaperScissorsHostActionSchemas = [
  RockPaperScissorsHostActionStartGameSchema,
  RockPaperScissorsHostActionCallRoundWinnerSchema,
  RockPaperScissorsHostActionCallGameWinnerSchema,
] as const;
export type AllRockPaperScissorsHostActionSchemas = typeof AllRockPaperScissorsHostActionSchemas;

// Union of all host actions
export const RockPaperScissorsHostActionSchema = BfgGameActionByHostSchema.describe('RockPaperScissorsHostAction');

export type RockPaperScissorsHostAction = z.infer<typeof RockPaperScissorsHostActionSchema>;

// export const GoFishHostActionOutcomeStartGameSchema = z.object({
//   hostActionOutcomeType: z.literal(GO_FISH_HOST_ACTION_OUTCOME_STARTS_GAME),
//   shuffledDeck: z.array(PlayingCardSchema),
//   initialHandSize: z.number(),
// });

// export type GoFishHostActionOutcomeStartGame = z.infer<typeof GoFishHostActionOutcomeStartGameSchema>;


// export const GoFishHostActionOutcomeTerminalMessageSchema = z.object({
//   hostActionOutcomeType: z.literal(GO_FISH_HOST_ACTION_OUTCOME_TERMINAL),
//   terminalMessage: z.string(),
// });

// export const RockPaperScissorsHostActionOutcomeSchema = z.discriminatedUnion('hostActionOutcomeType', [
//   RockPaperScissorsHostActionOutcomeCallChoiceSchema,
//   RockPaperScissorsHostActionOutcomeTerminalMessageSchema,
// ]);

// export type RockPaperScissorsHostActionOutcome = z.infer<typeof RockPaperScissorsHostActionOutcomeSchema>;


// export const GoFishPlayerHandStateSchema = BfgPrivatePlayerKnowledgeImplStateSchema.extend({
//   hand: z.array(PlayingCardSchema),
// }).describe('GoFishPlayerHandState');

// export type GoFishPlayerHandState = z.infer<typeof GoFishPlayerHandStateSchema>;

// export const GoFishPlayerBoardStateSchema = z.object({
//   completedSets: z.array(CardRankSchema),
//   handSize: z.number(),
//   score: z.number(),
// });

// export type GoFishPlayerBoardState = z.infer<typeof GoFishPlayerBoardStateSchema>;



export const RockPaperScissorsWatcherGameStateSchema = BfgGameStateForWatcherSchema.extend({
  p1Showing: RockPaperScissorsPlayerShowingSchema,
  p2Showing: RockPaperScissorsPlayerShowingSchema,

  p1WinCount: z.number(),
  p2WinCount: z.number(),
  tieCount: z.number(),
}).describe('RockPaperScissorsWatcherGameState');

export type RockPaperScissorsWatcherGameState = z.infer<typeof RockPaperScissorsWatcherGameStateSchema>;


export const RockPaperScissorsPlayerGameStateSchema = BfgGameStateForPlayerSchema.extend({
  myChoice: RockPaperScissorsPlayerChoiceSchema.nullable(),

  p1WinCount: z.number(),
  p2WinCount: z.number(),
  tieCount: z.number(),
}).describe('RockPaperScissorsPlayerGameState');

export type RockPaperScissorsPlayerGameState = z.infer<typeof RockPaperScissorsPlayerGameStateSchema>;


export const RockPaperScissorsHostGameStateSchema = BfgGameStateForHostSchema.extend({
  p1Choice: RockPaperScissorsPlayerChoiceSchema,
  p2Choice: RockPaperScissorsPlayerChoiceSchema,

  p1WinCount: z.number(),
  p2WinCount: z.number(),
  tieCount: z.number(),
}).describe('RockPaperScissorsHostGameState');

export type RockPaperScissorsHostGameState = z.infer<typeof RockPaperScissorsHostGameStateSchema>;



export const RockPaperScissorsBfgGameSpecificPlayerActionOutcomeSchema = BfgGameSpecificPlayerActionOutcomeSchema.extend({
  updatedGameState: RockPaperScissorsHostGameStateSchema,
});
export type RockPaperScissorsBfgGameSpecificPlayerActionOutcome = z.infer<typeof RockPaperScissorsBfgGameSpecificPlayerActionOutcomeSchema>;


export const RockPaperScissorsBfgGameSpecificHostActionOutcomeSchema = BfgGameSpecificHostActionOutcomeSchema.extend({
  updatedGameState: RockPaperScissorsHostGameStateSchema,
});
export type RockPaperScissorsBfgGameSpecificHostActionOutcome = z.infer<typeof RockPaperScissorsBfgGameSpecificHostActionOutcomeSchema>;
