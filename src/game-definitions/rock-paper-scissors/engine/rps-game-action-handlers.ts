import type { GameTable } from "../../../../../bfg-engine/src/models/game-table/game-table";
import {
  ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER,
  ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER,
  ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME,
  ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE,
  ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND,
} from "./action-types";
import {
  handleRockPaperScissorsHostActionCallGameWinner,
  handleRockPaperScissorsHostActionCallRoundWinner,
  handleRockPaperScissorsHostActionStartGame,
  type RockPaperScissorsHostActionCallGameWinner,
  type RockPaperScissorsHostActionCallRoundWinner,
  type RockPaperScissorsHostActionStartGame,
} from "./host-actions";
import {
  handleRockPaperScissorsPlayerActionConcede,
  handleRockPaperScissorsPlayerActionSetHand,
  type RockPaperScissorsPlayerActionConcede,
  type RockPaperScissorsPlayerActionSetHand,
} from "./player-actions";
import type {
  RockPaperScissorsBfgGameSpecificHostActionOutcome,
  RockPaperScissorsBfgGameSpecificPlayerActionOutcome,
  RockPaperScissorsHostAction,
  RockPaperScissorsHostGameState,
  RockPaperScissorsPlayerAction,
} from "../rock-paper-scissors-types";


type RockPaperScissorsGameAction =
  | RockPaperScissorsHostAction
  | RockPaperScissorsPlayerAction;

type RockPaperScissorsGameActionOutcome =
  | RockPaperScissorsBfgGameSpecificHostActionOutcome
  | RockPaperScissorsBfgGameSpecificPlayerActionOutcome;


export interface RockPaperScissorsGameActionHandler<
  Action extends RockPaperScissorsGameAction,
  Outcome extends RockPaperScissorsGameActionOutcome,
> {
  readonly name: string;
  readonly source: Action["source"];
  readonly actionType: Action["actionType"];
  readonly handle: (
    tableState: GameTable,
    gameState: RockPaperScissorsHostGameState,
    action: Action,
  ) => Promise<Outcome>;
}


const playerActionHandlers = [
  {
    name: ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND,
    source: "player",
    actionType: ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND,
    handle: async (
      tableState: GameTable,
      gameState: RockPaperScissorsHostGameState,
      action: RockPaperScissorsPlayerActionSetHand,
    ) =>
      handleRockPaperScissorsPlayerActionSetHand(tableState, gameState, action),
  } satisfies RockPaperScissorsGameActionHandler<
    RockPaperScissorsPlayerActionSetHand,
    RockPaperScissorsBfgGameSpecificPlayerActionOutcome
  >,
  {
    name: ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE,
    source: "player",
    actionType: ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE,
    handle: async (
      tableState: GameTable,
      gameState: RockPaperScissorsHostGameState,
      action: RockPaperScissorsPlayerActionConcede,
    ) =>
      handleRockPaperScissorsPlayerActionConcede(tableState, gameState, action),
  } satisfies RockPaperScissorsGameActionHandler<
    RockPaperScissorsPlayerActionConcede,
    RockPaperScissorsBfgGameSpecificPlayerActionOutcome
  >,
] as const;


const hostActionHandlers = [
  {
    name: ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME,
    source: "host",
    actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME,
    handle: async (
      tableState: GameTable,
      gameState: RockPaperScissorsHostGameState,
      action: RockPaperScissorsHostActionStartGame,
    ) =>
      handleRockPaperScissorsHostActionStartGame(tableState, gameState, action),
  } satisfies RockPaperScissorsGameActionHandler<
    RockPaperScissorsHostActionStartGame,
    RockPaperScissorsBfgGameSpecificHostActionOutcome
  >,
  {
    name: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER,
    source: "host",
    actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER,
    handle: async (
      tableState: GameTable,
      gameState: RockPaperScissorsHostGameState,
      action: RockPaperScissorsHostActionCallRoundWinner,
    ) =>
      handleRockPaperScissorsHostActionCallRoundWinner(
        tableState,
        gameState,
        action,
      ),
  } satisfies RockPaperScissorsGameActionHandler<
    RockPaperScissorsHostActionCallRoundWinner,
    RockPaperScissorsBfgGameSpecificHostActionOutcome
  >,
  {
    name: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER,
    source: "host",
    actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER,
    handle: async (
      tableState: GameTable,
      gameState: RockPaperScissorsHostGameState,
      action: RockPaperScissorsHostActionCallGameWinner,
    ) =>
      handleRockPaperScissorsHostActionCallGameWinner(
        tableState,
        gameState,
        action,
      ),
  } satisfies RockPaperScissorsGameActionHandler<
    RockPaperScissorsHostActionCallGameWinner,
    RockPaperScissorsBfgGameSpecificHostActionOutcome
  >,
] as const;



export const RockPaperScissorsGameActionHandlers = [
  ...playerActionHandlers,
  ...hostActionHandlers,
] as const;


// export type AnyRockPaperScissorsPlayerActionHandler =
//   typeof playerActionHandlers[number];

// export type AnyRockPaperScissorsHostActionHandler =
//   typeof hostActionHandlers[number];



export type RockPaperScissorsPlayerGameActionHandler =
  typeof playerActionHandlers[number];
export type RockPaperScissorsHostGameActionHandler =
  typeof hostActionHandlers[number];

export type AnyRockPaperScissorsGameActionHandler =
  RockPaperScissorsPlayerGameActionHandler |
  RockPaperScissorsHostGameActionHandler;

export type RockPaperScissorsGameActionHandlerName =
  typeof RockPaperScissorsGameActionHandlers[number]["name"];



export const handleRockPaperScissorsGameAction = async (
  tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  action: RockPaperScissorsGameAction,
): Promise<RockPaperScissorsGameActionOutcome> => {
  const handler = RockPaperScissorsGameActionHandlers.find(
    (candidate) =>
      candidate.source === action.source &&
      candidate.actionType === action.actionType,
  );

  if (handler !== undefined) {
    return (
      handler.handle as (
        tableState: GameTable,
        gameState: RockPaperScissorsHostGameState,
        action: RockPaperScissorsGameAction,
      ) => Promise<RockPaperScissorsGameActionOutcome>
    )(tableState, gameState, action);
  }

  throw new Error(
    `No rock paper scissors action handler found for ${action.source}:${action.actionType}`,
  );
};

