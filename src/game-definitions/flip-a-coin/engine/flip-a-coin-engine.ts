import { z } from "zod";
import { 
  GameTableSeatSchema,
  BfgGameSpecificTableAction,
  GameTableActionResult,
  BfgSupportedGameTitle,
} from "@bfg-engine";
import { GameTableSeat, ALL_PLAYER_SEATS } from "@bfg-engine/models/game-table/game-table";
import { GameTable } from "@bfg-engine/models/game-table/game-table";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { IBfgGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import type { DbGameTableAction } from "../../../../../bfg-engine/src/models/game-table/game-table-action";


export const FlipACoinGameName = 'Flip a Coin' as BfgSupportedGameTitle;


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


export const FlipACoinStartGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME),
})

export type FlipACoinStartGame = z.infer<typeof FlipACoinStartGameSchema>;


export const FlipACoinActionChooseCoinSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN),
  seat: GameTableSeatSchema,
  chosenCoin: CoinChoiceSchema,
})

export const FlipACoinActionFlipCoinSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN),
  seat: GameTableSeatSchema,
  flipResult: FlipACoinResultSchema,
})

export const FlipACoinActionPreferOutcomeSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT),
  seat: GameTableSeatSchema,
  preferredFlipResult: FlipACoinPlayerFlipResultPreferenceSchema,
})

export const FlipACoinActionCallItAndFinishGameSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME),
  seat: GameTableSeatSchema,
  calledFlipResult: FlipACoinResultSchema,
})

export const FlipACoinActionCancelGameSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME),
  seat: GameTableSeatSchema,
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


export const FlipACoinGameStateSchema = z.object({
  chosenCoin: CoinChoiceSchema,
  
  isGameOver: z.boolean(),
  finalFlipResult: FlipACoinResultSchema.optional(),
  outcomeSummary: z.string().optional(),

  isFlipped: z.boolean(),
  flipResult: FlipACoinResultSchema.optional(),  
  
  playerFlipResultPreferences: z.record(GameTableSeatSchema, FlipACoinPlayerFlipResultPreferenceSchema)
    .optional()
    .default({
      'p1': 'no-preference',
      'p2': 'no-preference',
      'p3': 'no-preference',
      'p4': 'no-preference',
      'p5': 'no-preference',
      'p6': 'no-preference',
      'p7': 'no-preference',
      'p8': 'no-preference',
    }),
}).describe('Flip A Coin');

export type FlipACoinGameState = z.infer<typeof FlipACoinGameStateSchema>;


const createInitialFlipACoinHostAction = (
  _gameTable: GameTable,
  _lobbyState: GameLobby,
): BfgGameSpecificTableAction<FlipACoinHostAction> => {
  return {
    gameTableActionId: `action-${Date.now()}` as any, // This should be properly generated
    source: 'game-table-action-source-host',
    actionType: 'game-table-action-host-starts-game',
    gameSpecificAction: {
      source: 'host',
      hostActionType: FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME,
    },
  };
}

const createInitialGameState = (
  _gameTable: GameTable,
  gameSpecificInitialAction: BfgGameSpecificTableAction<FlipACoinHostAction>,
): FlipACoinGameState => {

  if (gameSpecificInitialAction.gameSpecificAction.hostActionType !== FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME) {
    throw new Error("Initial game table action must be a host start game");
  }

  return {
    chosenCoin: 'penny',
    isGameOver: false,
    finalFlipResult: undefined,
    outcomeSummary: undefined,
    isFlipped: false,
    flipResult: undefined,
    playerFlipResultPreferences: {},
  };
}


const applyFlipACoinGameAction = async (
  _tableState: GameTable,
  gameState: FlipACoinGameState,
  gameAction: FlipACoinPlayerAction,
): Promise<GameTableActionResult<'player', FlipACoinGameState, null>> => {

  console.log("APPLY FLIP A COIN GAME ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN GAME ACTION - GAME ACTION", gameAction);

  if (gameAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN) {

    const summary = `Player ${gameAction.seat} chose ${gameAction.chosenCoin}`;

    return {
      tablePhase: 'table-phase-game-in-progress',
      actionSource: 'player',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        chosenCoin: gameAction.chosenCoin,
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  } 

  if (gameAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT) {
    const summary = `Player ${gameAction.seat} prefers ${gameAction.preferredFlipResult}`;

    return {
      tablePhase: 'table-phase-game-in-progress',
      actionSource: 'player',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        playerFlipResultPreferences: { 
          ...gameState.playerFlipResultPreferences,
          [gameAction.seat]: gameAction.preferredFlipResult,
        },
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  }
  
  if (gameAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN) {
    const summary = `Player ${gameAction.seat} flipped the ${gameState.chosenCoin} and got ${gameAction.flipResult}`;

    return {
      tablePhase: 'table-phase-game-in-progress',
      actionSource: 'player',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        isFlipped: true,
        flipResult: gameAction.flipResult,
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  }

  if (gameAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME) {
    const summary = `Player ${gameAction.seat} called it for ${gameState.flipResult}`;

    if (!gameState.isFlipped) {
      return {
        tablePhase: 'table-phase-error',
        actionSource: 'player',
        gameSpecificActionOutcome: null,
        gameSpecificState: {
          ...gameState,
          isGameOver: true,
          outcomeSummary: summary,
        },
        gameSpecificStateSummary: summary,
      }
    }

    const winningPlayers = ALL_PLAYER_SEATS.filter(seat => {
      const playerFlipResultPreference = gameState.playerFlipResultPreferences[seat];
      return playerFlipResultPreference === gameState.flipResult;
    });

    const anyWinners = winningPlayers.length > 0;

    if (anyWinners) {
      const summary = `Player ${gameAction.seat} called it for ${gameState.flipResult} - ${winningPlayers.join(', ')} win`;

      return {
        tablePhase: 'table-phase-game-complete-with-winners',
        actionSource: 'player',
        gameSpecificActionOutcome: null,
        gameSpecificState: {
          ...gameState,
          isGameOver: true,
          finalFlipResult: gameState.flipResult,
          outcomeSummary: summary,
        },
        gameSpecificStateSummary: summary,
      }
    }

    const drawSummary = `Player ${gameAction.seat} called it for ${gameState.flipResult} - no winners`;

    return {
      tablePhase: 'table-phase-game-complete-with-draw',
      actionSource: 'player',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        finalFlipResult: gameState.flipResult,
        outcomeSummary: drawSummary,
      },
      gameSpecificStateSummary: drawSummary,
    }
  }

  if (gameAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME) {
    return {
      tablePhase: 'table-phase-game-abandoned',
      actionSource: 'player',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: gameAction.cancellationReason,
      },
      gameSpecificStateSummary: gameAction.cancellationReason,
    }
  }

  return {
    tablePhase: 'table-phase-error',
    actionSource: 'player',
    gameSpecificActionOutcome: null,
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid game action`,
  };
}


const applyFlipACoinHostAction = async (
  _tableState: GameTable,
  gameState: FlipACoinGameState,
  hostAction: FlipACoinHostAction,
): Promise<GameTableActionResult<'host', FlipACoinGameState, null>> => {

  console.log("APPLY FLIP A COIN HOST ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN HOST ACTION - HOST ACTION", hostAction);

  if (hostAction.hostActionType === FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME) {
    const summary = `Host started the game`;

    return {
      tablePhase: 'table-phase-game-in-progress',
      actionSource: 'host',
      gameSpecificActionOutcome: null,
      gameSpecificState: {
        ...gameState,
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  }

  return {
    tablePhase: 'table-phase-error',
    actionSource: 'host',
    gameSpecificActionOutcome: null,
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid host action`,
  };
}

const getNextToActPlayers = (gameTable: GameTable, gameState: FlipACoinGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
    return [];
  }

  const nextPlayersToAct = getActivePlayerSeatsForGameTable(gameTable);

  return nextPlayersToAct;
}

const getPlayerDetailsLine = (gameState: FlipACoinGameState, playerSeat: GameTableSeat): React.ReactNode => {
  const playerFlipResultPreference = gameState.playerFlipResultPreferences[playerSeat];
  
  if (!gameState.isGameOver) {
    return `Player ${playerSeat} wants ${playerFlipResultPreference}`;
  }

  if (gameState.finalFlipResult === playerFlipResultPreference) {
    return `Player ${playerSeat} won with ${gameState.finalFlipResult}`;
  } 
  
  return `Player ${playerSeat} lost with ${gameState.finalFlipResult}`;
}


const flipACoinProcessorImplementation: IBfgGameProcessor<
  FlipACoinGameState,
  FlipACoinGameState,
  FlipACoinPlayerAction,
  null,
  FlipACoinHostAction,
  null,
  null
> = {
  gameTitle: FlipACoinGameName,

  createGameSpecificInitialAction: createInitialFlipACoinHostAction,
  createGameSpecificInitialState: createInitialGameState,
  applyPlayerAction: applyFlipACoinGameAction,
  applyHostAction: applyFlipACoinHostAction,

  getNextToActPlayers: getNextToActPlayers,
  getPlayerDetailsLine: getPlayerDetailsLine,
  getAllPlayersPrivateKnowledge: () => null,
  summarizeGameAction: (gameAction: DbGameTableAction) => `Flip a coin action: ${gameAction.actionType}`,
}


export const FlipACoinGameProcessor = flipACoinProcessorImplementation;
