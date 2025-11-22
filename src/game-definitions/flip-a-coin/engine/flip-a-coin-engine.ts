import { z } from "zod";
import React from "react";
import { 
  GameTableSeatSchema,
  BfgSupportedGameTitle,
} from "@bfg-engine";
import { GameTableSeat, ALL_PLAYER_SEATS } from "@bfg-engine/models/internal/game-room-base";
import { GameRoomP2p } from "@bfg-engine/models/p2p/game-room-p2p";
import { BfgGameActionByPlayerSchema, BfgGameActionByHostSchema, BfgGamePlayerActionOutcomeSchema, BfgGameHostActionOutcomeSchema, BfgGameEventOutcomeSchema, type BfgGameActionByPlayer, type BfgGameActionByHost, type BfgGamePlayerActionOutcome, type BfgGameHostActionOutcome } from "@bfg-engine/game-metadata/metadata-types/game-action-types";
import { BfgGameStateForHostSchema, type BfgGameStateForHost } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { IBfgGameProcessor, ApplyPlayerActionResult, ApplyHostActionResult, PlayerActionOutcomeSummary, HostActionOutcomeSummary } from "@bfg-engine/game-metadata/factories/complete-game-processor-factory";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { ROOM_PHASE_GAME_IN_PROGRESS, ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS, ROOM_PHASE_GAME_COMPLETE_WITH_DRAW, ROOM_PHASE_GAME_ABANDONED, ROOM_PHASE_ERROR } from "@bfg-engine/models/internal/table-phase";
import type { GameTableEventWithTransition } from "@bfg-engine/models/game-table/game-table-event";


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


const createHostStartsGameAction = <
  GAH extends BfgGameActionByHost,
>(lobbyState: GameLobby): GAH => {
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
  
  // Type assertion needed at generic interface boundary - FlipACoinStartGame extends BfgGameActionByHost
  return parsed as unknown as GAH;
}

const createHostOpensGameOutcome = <
  GAH extends BfgGameActionByHost,
  GHAO extends BfgGameHostActionOutcome,
>(_startGameAction: GAH): GHAO => {
  const outcome = {
    description: 'Flip a Coin started by host',
  };

  // Validate against schema to ensure type safety
  const parsed = FlipACoinHostActionOutcomeSchema.parse(outcome);
  
  // Cast to generic type - this is safe because FlipACoinHostActionOutcome extends BfgGameHostActionOutcome
  return parsed as GHAO;
}

const createHostOpensGameState = <
  GAH extends BfgGameActionByHost,
  GSH extends BfgGameStateForHost,
>(startGameAction: GAH): GSH => {
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
  
  // Type assertion needed at generic interface boundary - FlipACoinGameState extends BfgGameStateForHost
  // This is safe because FlipACoinGameState extends BfgGameStateForHost, but TypeScript can't prove
  // that it satisfies every possible instantiation of GSH
  const result: GSH = parsedState as unknown as GSH;
  return result;
}


const applyPlayerAction = async <
  GSH extends BfgGameStateForHost,
  GPA extends BfgGameActionByPlayer,
  GPAO extends BfgGamePlayerActionOutcome,
>(
  _gameRoom: GameRoomP2p,
  gameState: GSH,
  playerAction: GPA,
): Promise<ApplyPlayerActionResult<GSH, GPA, GPAO>> => {

  console.log("APPLY FLIP A COIN GAME ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN GAME ACTION - GAME ACTION", playerAction);

  const typedPlayerAction = playerAction as unknown as FlipACoinPlayerAction;
  const typedGameState = gameState as unknown as FlipACoinGameState;
  const playerSeat = typedPlayerAction.playerSeat;

  if (typedPlayerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN) {
    const summary = `Player ${playerSeat} chose ${typedPlayerAction.chosenCoin}`;

    return {
      playerAction,
      playerActionOutcome: {} as GPAO,
      updatedGameState: {
        ...typedGameState,
        chosenCoin: typedPlayerAction.chosenCoin,
        outcomeSummary: summary,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  } 

  if (typedPlayerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT) {
    const summary = `Player ${playerSeat} prefers ${typedPlayerAction.preferredFlipResult}`;

    // Update or add preference for this seat
    const existingPrefIndex = typedGameState.playerFlipResultPreferences.findIndex(pref => pref.seat === playerSeat);
    const updatedPreferences = existingPrefIndex >= 0
      ? typedGameState.playerFlipResultPreferences.map((pref, index) => 
          index === existingPrefIndex 
            ? { seat: playerSeat, preference: typedPlayerAction.preferredFlipResult }
            : pref
        )
      : [...typedGameState.playerFlipResultPreferences, { seat: playerSeat, preference: typedPlayerAction.preferredFlipResult }];

    return {
      playerAction,
      playerActionOutcome: {} as GPAO,
      updatedGameState: {
        ...typedGameState,
        playerFlipResultPreferences: updatedPreferences,
        outcomeSummary: summary,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }
  
  if (typedPlayerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN) {
    const summary = `Player ${playerSeat} flipped the ${typedGameState.chosenCoin} and got ${typedPlayerAction.flipResult}`;

    return {
      playerAction,
      playerActionOutcome: {} as GPAO,
      updatedGameState: {
        ...typedGameState,
        isFlipped: true,
        flipResult: typedPlayerAction.flipResult,
        outcomeSummary: summary,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }

  if (typedPlayerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME) {
    if (!typedGameState.isFlipped) {
      return {
        playerAction,
        playerActionOutcome: {} as GPAO,
        updatedGameState: {
          ...typedGameState,
          isGameOver: true,
          outcomeSummary: `Player ${playerSeat} called it but coin hasn't been flipped`,
        } as unknown as GSH,
        updatedRoomPhase: ROOM_PHASE_ERROR,
      }
    }

    const winningPlayers = typedGameState.playerFlipResultPreferences
      .filter(pref => pref.preference === typedGameState.flipResult)
      .map(pref => pref.seat);

    const anyWinners = winningPlayers.length > 0;

    if (anyWinners) {
      const summary = `Player ${playerSeat} called it for ${typedGameState.flipResult} - ${winningPlayers.join(', ')} win`;

      return {
        playerAction,
        playerActionOutcome: {} as GPAO,
        updatedGameState: {
          ...typedGameState,
          isGameOver: true,
          finalFlipResult: typedGameState.flipResult,
          outcomeSummary: summary,
        } as unknown as GSH,
        updatedRoomPhase: ROOM_PHASE_GAME_COMPLETE_WITH_WINNERS,
      }
    }

    const drawSummary = `Player ${playerSeat} called it for ${typedGameState.flipResult} - no winners`;

    return {
      playerAction,
      playerActionOutcome: {} as GPAO,
      updatedGameState: {
        ...typedGameState,
        isGameOver: true,
        finalFlipResult: typedGameState.flipResult,
        outcomeSummary: drawSummary,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_COMPLETE_WITH_DRAW,
    }
  }

  if (typedPlayerAction.playerActionType === FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME) {
    return {
      playerAction,
      playerActionOutcome: {} as GPAO,
      updatedGameState: {
        ...typedGameState,
        isGameOver: true,
        outcomeSummary: typedPlayerAction.cancellationReason,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_ABANDONED,
    }
  }

  return {
    playerAction,
    playerActionOutcome: {} as GPAO,
    updatedGameState: gameState,
    updatedRoomPhase: ROOM_PHASE_ERROR,
  };
}


const applyHostAction = async <
  GSH extends BfgGameStateForHost,
  GAH extends BfgGameActionByHost,
  GHAO extends BfgGameHostActionOutcome,
>(
  _gameRoom: GameRoomP2p,
  gameState: GSH,
  hostAction: GAH,
): Promise<ApplyHostActionResult<GSH, GAH, GHAO>> => {

  console.log("APPLY FLIP A COIN HOST ACTION - GAME STATE", gameState);
  console.log("APPLY FLIP A COIN HOST ACTION - HOST ACTION", hostAction);

  const typedHostAction = hostAction as unknown as FlipACoinHostAction;
  const typedGameState = gameState as unknown as FlipACoinGameState;

  if (typedHostAction.hostActionType === FLIP_A_COIN_GAME_TABLE_ACTION_START_GAME) {
    const summary = `Host started the game`;

    return {
      hostAction,
      hostActionOutcome: {} as GHAO,
      updatedGameState: {
        ...typedGameState,
        outcomeSummary: summary,
      } as unknown as GSH,
      updatedRoomPhase: ROOM_PHASE_GAME_IN_PROGRESS,
    }
  }

  return {
    hostAction,
    hostActionOutcome: {} as GHAO,
    updatedGameState: gameState,
    updatedRoomPhase: ROOM_PHASE_ERROR,
  };
}

const getNextToActPlayers = <
  GSH extends BfgGameStateForHost,
>(gameRoom: GameRoomP2p, gameState: GSH): GameTableSeat[] => {
  const typedGameState = gameState as unknown as FlipACoinGameState;
  if (typedGameState.isGameOver) {
    return [];
  }

  const nextPlayersToAct = getActivePlayerSeatsForGameTable(gameRoom);

  return nextPlayersToAct;
}

const getPlayerDetailsLine = <
  GSH extends BfgGameStateForHost,
>(_gameRoom: GameRoomP2p, gameState: GSH, playerSeat: GameTableSeat): React.ReactNode => {
  const typedGameState = gameState as unknown as FlipACoinGameState;
  const playerPref = typedGameState.playerFlipResultPreferences.find(pref => pref.seat === playerSeat);
  const playerFlipResultPreference = playerPref?.preference ?? 'no-preference';
  
  if (!typedGameState.isGameOver) {
    return `Player ${playerSeat} wants ${playerFlipResultPreference}`;
  }

  if (typedGameState.finalFlipResult === playerFlipResultPreference) {
    return `Player ${playerSeat} won with ${typedGameState.finalFlipResult}`;
  } 
  
  return `Player ${playerSeat} lost with ${typedGameState.finalFlipResult}`;
}


const summarizeGameEvent = (gameEvent: GameTableEventWithTransition): string => {
  return `Flip a coin event: ${gameEvent.eventType}`;
}

const summarizePlayerActionOutcome = <
  GPAO extends BfgGamePlayerActionOutcome,
>(_playerActionOutcome: GPAO): PlayerActionOutcomeSummary => {
  return 'Flip a coin player action completed' as PlayerActionOutcomeSummary;
}

const summarizeHostActionOutcome = <
  GHAO extends BfgGameHostActionOutcome,
>(_hostActionOutcome: GHAO): HostActionOutcomeSummary => {
  return 'Flip a coin host action completed' as HostActionOutcomeSummary;
}

export const FlipACoinPlayerActionOutcomeSchema = BfgGamePlayerActionOutcomeSchema;
export type FlipACoinPlayerActionOutcome = z.infer<typeof FlipACoinPlayerActionOutcomeSchema>;

export const FlipACoinHostActionOutcomeSchema = BfgGameHostActionOutcomeSchema;
export type FlipACoinHostActionOutcome = z.infer<typeof FlipACoinHostActionOutcomeSchema>;

export const FlipACoinGameEventOutcomeSchema = BfgGameEventOutcomeSchema.extend({}).describe('FlipACoinGameEventOutcome');
export type FlipACoinGameEventOutcome = z.infer<typeof FlipACoinGameEventOutcomeSchema>;

export const FlipACoinGameProcessor: IBfgGameProcessor = {
  createHostStartsGameAction,
  createHostOpensGameOutcome,
  createHostOpensGameState,
  applyPlayerAction,
  applyHostAction,
  getNextToActPlayers,
  getPlayerDetailsLine,
  summarizeGameEvent,
  summarizePlayerActionOutcome,
  summarizeHostActionOutcome,
};
