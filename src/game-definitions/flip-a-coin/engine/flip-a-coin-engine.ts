import { z } from "zod";
import React from "react";
import { 
  GameTableSeatSchema,
  BfgSupportedGameTitle,
} from "@bfg-engine";
import { GameTableSeat, ALL_PLAYER_SEATS } from "@bfg-engine/models/internal/game-room-base";
import { GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { BfgGameActionByPlayerSchema, BfgGameActionByHostSchema } from "@bfg-engine/game-metadata/metadata-types/game-action-types";
import { BfgGameStateForHostSchema } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { PlayerActionOutcomeSummary, HostActionOutcomeSummary } from "@bfg-engine/game-metadata/factories/complete-game-processor-factory";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { ROOM_PHASE_GAME_IN_PROGRESS, ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS, ROOM_PHASE_GAME_COMPLETE_WITH_DRAW, ROOM_PHASE_GAME_ABANDONED, ROOM_PHASE_ERROR } from "@bfg-engine/models/internal/table-phase";
import type { GameTableEventWithTransition } from "@bfg-engine/models/game-table/game-table-event";
import { FlipACoinHostActionOutcomeSchema, FlipACoinPlayerActionOutcomeSchema, type FlipACoinHostActionOutcome, type FlipACoinPlayerActionOutcome } from "../game-types";
import { createBfgGameProcessor } from "@bfg-engine/game-metadata/factories/game-processor-factory";


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


const createHostStartsGameAction = (lobbyState: GameLobby): FlipACoinStartGame => {
  // Players are assigned seats based on their index in playerPool
  const activePlayerSeats = lobbyState.playerPool.map((_player, index) => 
    ALL_PLAYER_SEATS[index]).filter((seat): seat is GameTableSeat => seat !== undefined);
  
  const action = {
    source: 'host' as const,
    hostActionType: FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME,
    activePlayerSeats,
  };

  // Validate against schema to ensure type safety at runtime
  const parsed = FlipACoinStartGameSchema.parse(action);
  
  return parsed;
}

const createHostOpensGameOutcome = (_startGameAction: FlipACoinStartGame): FlipACoinHostActionOutcome => {
  const outcome = {
    description: 'Flip a Coin started by host',
  };

  // Validate against schema to ensure type safety
  const parsed = FlipACoinHostActionOutcomeSchema.parse(outcome);
  
  // Type assertion needed because the schema allows description but the type is StrictEmptyObject
  return parsed as unknown as FlipACoinHostActionOutcome;
}

const createHostOpensGameState = (startGameAction: FlipACoinStartGame): FlipACoinGameState => {
  // Validate the action against our schema to extract typed information
  const parsedAction = FlipACoinStartGameSchema.safeParse(startGameAction);
  
  if (!parsedAction.success) {
    throw new Error('Invalid start game action');
  }

  // Extract player seats from the validated start game action
  const activePlayerSeats = parsedAction.data.activePlayerSeats;
  
  // Initialize preferences only for seats that have players
  const playerFlipResultPreferences = activePlayerSeats.map((seat) => ({
    seat,
    preference: 'no-preference' as FlipACoinPlayerFlipResultPreference,
  }));

  const state = {
    chosenCoin: 'penny' as const,
    isGameOver: false,
    finalFlipResult: undefined,
    outcomeSummary: undefined,
    isFlipped: false,
    flipResult: undefined,
    playerFlipResultPreferences,
  };

  // Validate against schema to ensure type safety at runtime
  const parsedState = FlipACoinGameStateSchema.parse(state);
  
  return parsedState;
}


const applyPlayerAction = async (
  _gameRoom: GameRoomP2p,
  gameState: FlipACoinGameState,
  playerAction: FlipACoinPlayerAction,
) => {

  console.log("APPLY FLIP A COIN GAME ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN GAME ACTION - GAME ACTION", playerAction);

  const playerSeat = playerAction.playerSeat;

  if (playerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN) {
    const summary = `Player ${playerSeat} chose ${playerAction.chosenCoin}`;

    const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
      description: summary,
    });

    return {
      playerAction,
      playerActionOutcome,
      updatedGameState: {
        ...gameState,
        chosenCoin: playerAction.chosenCoin,
        outcomeSummary: summary,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  } 

  if (playerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT) {
    const summary = `Player ${playerSeat} prefers ${playerAction.preferredFlipResult}`;

    // Update or add preference for this seat
    const existingPrefIndex = gameState.playerFlipResultPreferences.findIndex(pref => pref.seat === playerSeat);
    const updatedPreferences = existingPrefIndex >= 0
      ? gameState.playerFlipResultPreferences.map((pref, index) => 
          index === existingPrefIndex 
            ? { seat: playerSeat, preference: playerAction.preferredFlipResult }
            : pref
        )
      : [...gameState.playerFlipResultPreferences, { seat: playerSeat, preference: playerAction.preferredFlipResult }];

    const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
      description: summary,
    });

    return {
      playerAction,
      playerActionOutcome,
      updatedGameState: {
        ...gameState,
        playerFlipResultPreferences: updatedPreferences,
        outcomeSummary: summary,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }
  
  if (playerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN) {
    const summary = `Player ${playerSeat} flipped the ${gameState.chosenCoin} and got ${playerAction.flipResult}`;

    const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
      description: summary,
    });

    return {
      playerAction,
      playerActionOutcome,
      updatedGameState: {
        ...gameState,
        isFlipped: true,
        flipResult: playerAction.flipResult,
        outcomeSummary: summary,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }

  if (playerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME) {
    if (!gameState.isFlipped) {
      const errorSummary = `Player ${playerSeat} called it but coin hasn't been flipped`;
      const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
        description: errorSummary,
      });

      return {
        playerAction,
        playerActionOutcome,
        updatedGameState: {
          ...gameState,
          isGameOver: true,
          outcomeSummary: errorSummary,
        },
        updatedRoomPhase: ROOM_PHASE_ERROR,
      }
    }

    const winningPlayers = gameState.playerFlipResultPreferences
      .filter(pref => pref.preference === gameState.flipResult)
      .map(pref => pref.seat);

    const anyWinners = winningPlayers.length > 0;

    if (anyWinners) {
      const summary = `Player ${playerSeat} called it for ${gameState.flipResult} - ${winningPlayers.join(', ')} win`;
      const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
        description: summary,
      });

      return {
        playerAction,
        playerActionOutcome,
        updatedGameState: {
          ...gameState,
          isGameOver: true,
          finalFlipResult: gameState.flipResult,
          outcomeSummary: summary,
        },
        updatedRoomPhase: ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS,
      }
    }

    const drawSummary = `Player ${playerSeat} called it for ${gameState.flipResult} - no winners`;
    const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
      description: drawSummary,
    });

    return {
      playerAction,
      playerActionOutcome,
      updatedGameState: {
        ...gameState,
        isGameOver: true,
        finalFlipResult: gameState.flipResult,
        outcomeSummary: drawSummary,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_COMPLETE_WITH_DRAW,
    }
  }

  if (playerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME) {
    const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
      description: playerAction.cancellationReason,
    });

    return {
      playerAction,
      playerActionOutcome,
      updatedGameState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: playerAction.cancellationReason,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_ABANDONED,
    }
  }

  const playerActionOutcome = FlipACoinPlayerActionOutcomeSchema.parse({
    description: 'Invalid player action',
  });

  return {
    playerAction,
    playerActionOutcome,
    updatedGameState: gameState,
    updatedRoomPhase: ROOM_PHASE_ERROR,
  };
}


const applyHostAction = async (
  _gameRoom: GameRoomP2p,
  gameState: FlipACoinGameState,
  hostAction: FlipACoinHostAction,
) => {

  console.log("APPLY FLIP A COIN HOST ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN HOST ACTION - HOST ACTION", hostAction);

  if (hostAction.hostActionType === FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME) {
    const summary = `Host started the game`;
    const hostActionOutcome = FlipACoinHostActionOutcomeSchema.parse({
      description: summary,
    });

    return {
      hostAction,
      hostActionOutcome,
      updatedGameState: {
        ...gameState,
        outcomeSummary: summary,
      },
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }

  const hostActionOutcome = FlipACoinHostActionOutcomeSchema.parse({
    description: 'Invalid host action',
  });

  return {
    hostAction,
    hostActionOutcome,
    updatedGameState: gameState,
    updatedRoomPhase: ROOM_PHASE_ERROR,
  };
}

const getNextToActPlayers = (gameRoom: GameRoomP2p, gameState: FlipACoinGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
    return [];
  }

  const nextPlayersToAct = getActivePlayerSeatsForGameTable(gameRoom);

  return nextPlayersToAct;
}

const getPlayerDetailsLine = (_gameRoom: GameRoomP2p, gameState: FlipACoinGameState, playerSeat: GameTableSeat): React.ReactNode => {
  const playerPref = gameState.playerFlipResultPreferences.find(pref => pref.seat === playerSeat);
  const playerFlipResultPreference = playerPref?.preference ?? 'no-preference';
  
  if (!gameState.isGameOver) {
    return `Player ${playerSeat} wants ${playerFlipResultPreference}`;
  }

  if (gameState.finalFlipResult === playerFlipResultPreference) {
    return `Player ${playerSeat} won with ${gameState.finalFlipResult}`;
  } 
  
  return `Player ${playerSeat} lost with ${gameState.finalFlipResult}`;
}


const summarizeGameEvent = (gameEvent: GameTableEventWithTransition): string => {
  return `Flip a coin event: ${gameEvent.eventType}`;
}

const summarizePlayerActionOutcome = (_playerActionOutcome: FlipACoinPlayerActionOutcome): PlayerActionOutcomeSummary => {
  return 'Flip a coin player action completed' as PlayerActionOutcomeSummary;
}

const summarizeHostActionOutcome = (_hostActionOutcome: FlipACoinHostActionOutcome): HostActionOutcomeSummary => {
  return 'Flip a coin host action completed' as HostActionOutcomeSummary;
}

// export const FlipACoinGameProcessor: IBfgGameProcessor = {
//   createHostStartsGameAction,
//   createHostOpensGameOutcome,
//   createHostOpensGameState,
//   applyPlayerAction,
//   applyHostAction,
//   getNextToActPlayers,
//   getPlayerDetailsLine,
//   summarizeGameEvent,
//   summarizePlayerActionOutcome,
//   summarizeHostActionOutcome,
// };


export const FlipACoinGameProcessor = createBfgGameProcessor({
  schemas: {
    hostGameStateSchema: FlipACoinGameStateSchema,
    playerGameStateSchema: FlipACoinGameStateSchema,
    watcherGameStateSchema: FlipACoinGameStateSchema,
    gameEventSchema: FlipACoinGameEventSchema,
    gameEventOutcomeSchema: FlipACoinPlayerActionOutcomeSchema,
  },
  gameFunctions: {
    createHostStartsGameAction,
    createHostOpensGameOutcome,
    createHostOpensGameState,
    getNextToActPlayers,
    getPlayerDetailsLine,
    summarizeGameEvent,
    summarizePlayerActionOutcome,
    summarizeHostActionOutcome,
    applyPlayerAction,
    applyHostAction,
  },
});
