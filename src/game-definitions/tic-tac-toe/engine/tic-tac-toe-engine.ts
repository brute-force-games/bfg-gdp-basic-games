import { z } from "zod";
import { BfgSupportedGameTitle, GameTableSeatSchema } from "@bfg-engine";
import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-uuids";
import { GameTable, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { GameTableActionResult } from "@bfg-engine/models/game-table/table-phase";
import { BfgGameSpecificTableAction } from "@bfg-engine/models/game-table/game-table-action";
import type { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { BfgGameImplHostActionSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { IBfgGameProcessor } from "@bfg-engine/game-metadata/factories/complete-game-processor-factory";
import { BfgGameActionByPlayerSchema } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";


export const TicTacToeGameName = 'Tic Tac Toe' as BfgSupportedGameTitle;

export const TicTacToeResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-draw',
  'game-over-x-wins',
  'game-over-o-wins',
])

export type TicTacToeResolution = z.infer<typeof TicTacToeResolutionSchema>;


export const TicTacToeMoveCellSchema = z.enum([
  'a1', 'b1', 'c1',
  'a2', 'b2', 'c2',
  'a3', 'b3', 'c3',
])

export type TicTacToeMoveCell = z.infer<typeof TicTacToeMoveCellSchema>;


export const TicTacToeSetupBoardSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal('game-table-action-host-starts-game'),
  board: z.string().length(9),
})

export type TicTacToeSetupBoard = z.infer<typeof TicTacToeSetupBoardSchema>;


export const TicTacToeMoveSchema = BfgGameActionByPlayerSchema.extend({
  actionType: z.literal('game-table-action-player-move'),
  moveCell: TicTacToeMoveCellSchema,
  movePlayer: GameTableSeatSchema,
})

export type TicTacToeMove = z.infer<typeof TicTacToeMoveSchema>;



export const TicTacToePlayerActionSchema = z.discriminatedUnion('playerActionType', [
  TicTacToeMoveSchema,
])

export type TicTacToePlayerAction = z.infer<typeof TicTacToePlayerActionSchema>;


export const TicTacToeHostActionSchema = z.discriminatedUnion('hostActionType', [
  TicTacToeSetupBoardSchema, 
])

export type TicTacToeHostAction = z.infer<typeof TicTacToeHostActionSchema>;


// export const FlipACoinPlayerActionSchema = z.discriminatedUnion('playerActionType', [
//   FlipACoinActionChooseCoinSchema, 
//   FlipACoinActionFlipCoinSchema,
//   FlipACoinActionPreferOutcomeSchema,
//   FlipACoinActionCallItAndFinishGameSchema,
//   FlipACoinActionCancelGameSchema,
// ])

// export type FlipACoinPlayerAction = z.infer<typeof FlipACoinPlayerActionSchema>;


// export const FlipACoinHostActionSchema = z.discriminatedUnion('hostActionType', [
//   FlipACoinStartGameSchema,
// ])

// export type FlipACoinHostAction = z.infer<typeof FlipACoinHostActionSchema>;


// export const TicTacToeGameActionSchema = z.discriminatedUnion('actionType', [
//   TicTacToeSetupBoardSchema,
//   TicTacToeMoveSchema,
// ])

// export type TicTacToeGameAction = z.infer<typeof TicTacToeGameActionSchema>;


export const TicTacToeGameStateSchema = BfgGameSpecificGameStateSchema.extend({
  board: z.string().length(9),
  nextPlayersToAct: z.array(GameTableSeatSchema),
  resolution: TicTacToeResolutionSchema,
}).describe('Tic Tac Toe');

export type TicTacToeGameState = z.infer<typeof TicTacToeGameStateSchema>;

// export const TicTacToeGameName = 'Tic Tac Toe' as const;


// const initialGameState: TicTacToeGameState = {
//   board: "---------",
//   // currentPlayer: 'p1' as GameTableSeat,
//   nextPlayersToAct: ['p1'],
//   resolution: 'game-in-progress' as TicTacToeResolution,
// }


const createTicTacToeInitialGameState = (
  _gameTable: GameTable,
  initialGameTableAction: BfgGameSpecificTableAction<TicTacToeHostAction>,
): TicTacToeGameState => {

  if (initialGameTableAction.gameSpecificAction.hostActionType !== 'game-table-action-host-starts-game') {
    throw new Error("Initial game action must be a host starts game");
  }

  const initialGameState: TicTacToeGameState = {
    board: initialGameTableAction.gameSpecificAction.board,
    nextPlayersToAct: ['p1'],
    resolution: 'game-in-progress' as TicTacToeResolution,
  }

  return initialGameState;
}


const createTicTacToeInitialGameTableAction = (
  _gameTable: GameTable,
  _lobbyState: GameLobby,
): BfgGameSpecificTableAction<TicTacToeHostAction> => {
  const initialGameTableAction: TicTacToeHostAction = {
    source: 'host',
    hostActionType: 'game-table-action-host-starts-game',
    board: "---------",
  }

  const gameTableActionId = BfgGameTableActionId.createId();

  const gameSpecificTableAction: BfgGameSpecificTableAction<TicTacToeHostAction> = {  
    gameSpecificAction: initialGameTableAction,
    gameTableActionId: gameTableActionId,
    source: 'game-table-action-source-host',
    actionType: 'game-table-action-host-starts-game',
  }

  return gameSpecificTableAction;
}


const createNextPlayersToAct = (gameAction: TicTacToeMove, _gameState: TicTacToeGameState): GameTableSeat[] => {
  if (gameAction.movePlayer === 'p2') {
    return ['p1'];
  }

  return ['p2'];
}


const applyTicTacToePlayerAction = async (
  _tableState: GameTable,
  gameState: TicTacToeGameState,
  playerAction: TicTacToePlayerAction,
): Promise<GameTableActionResult<'player', TicTacToeGameState, null>> => {

  const board = gameState.board;
  if (gameState.nextPlayersToAct.length !== 1) {
    throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  }

  const moveCell = playerAction.moveCell;
  const movePlayer = playerAction.movePlayer;

  const playerSymbol = movePlayer === 'p1' ? 'X' : 'O';

  // Convert coordinate format (a1-c3) to array index
  const col = moveCell[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const row = parseInt(moveCell[1]) - 1;
  const moveIndex = row * 3 + col;

  const boardArray = board.split('');
  boardArray[moveIndex] = playerSymbol;
  const newBoard = boardArray.join('');

  const nextPlayersToAct = createNextPlayersToAct(playerAction, gameState);

  const newGameState: TicTacToeGameState = {
    board: newBoard,
    nextPlayersToAct,
    resolution: 'game-in-progress' as TicTacToeResolution,
  }

  // Check for win conditions
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (newBoard[a] === playerSymbol && 
        newBoard[b] === playerSymbol && 
        newBoard[c] === playerSymbol)
    {
      newGameState.resolution = playerSymbol === 'X' ? 'game-over-x-wins' : 'game-over-o-wins';
      return {
        tablePhase: 'table-phase-game-complete-with-winners',
        actionSource: 'player',
        gameSpecificState: newGameState,
        gameSpecificActionOutcome: null,
        gameSpecificStateSummary: `Player ${movePlayer} ${playerSymbol} wins`,
      };
    }
  }

  // Check for draw
  if (!newBoard.includes('-')) {
    newGameState.resolution = 'game-over-draw';
    return {
      tablePhase: 'table-phase-game-complete-with-draw',
      actionSource: 'player',
      gameSpecificState: newGameState,
      gameSpecificActionOutcome: null,
      gameSpecificStateSummary: 'Game is a draw',
    };
  }

  return {
    tablePhase: 'table-phase-game-in-progress',
    actionSource: 'player',
    gameSpecificState: newGameState,
    gameSpecificActionOutcome: null,
    gameSpecificStateSummary: `Player ${movePlayer} ${playerSymbol} takes ${moveCell}`,
  };
}


const applyTicTacToeHostAction = async (
  _tableState: GameTable,
  gameState: TicTacToeGameState,
  _hostAction: TicTacToeHostAction,
): Promise<GameTableActionResult<'host', TicTacToeGameState, null>> => {
  // For now, host actions don't change the game state in Tic Tac Toe
  // The host only sets up the initial board
  return {
    tablePhase: 'table-phase-game-in-progress',
    actionSource: 'host',
    gameSpecificState: gameState,
    gameSpecificActionOutcome: null,
    gameSpecificStateSummary: 'Host action processed',
  };
}


const getNextToActPlayers = (_gameTable: GameTable, gameState: TicTacToeGameState): GameTableSeat[] => {
  if (gameState.nextPlayersToAct.length !== 1) {
    throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  }
  return gameState.nextPlayersToAct;
}


const getPlayerDetailsLine = (_gameState: TicTacToeGameState, playerSeat: GameTableSeat): React.ReactNode => {
  return getPlayerSeatSymbol(playerSeat);
}


const ticTacToeProcessorImplementation: IBfgGameProcessor<
  TicTacToeGameState,
  TicTacToeGameState,
  TicTacToePlayerAction,
  null,
  TicTacToeHostAction,
  null,
  null
> = {
  gameTitle: TicTacToeGameName,

  createGameSpecificInitialAction: createTicTacToeInitialGameTableAction,
  createGameSpecificInitialState: createTicTacToeInitialGameState,
  applyPlayerAction: applyTicTacToePlayerAction,
  applyHostAction: applyTicTacToeHostAction,

  getNextToActPlayers: getNextToActPlayers,
  getPlayerDetailsLine: getPlayerDetailsLine,
  getAllPlayersPrivateKnowledge: () => null,
  summarizeGameAction: (gameAction: DbGameTableAction) => `Player action: ${gameAction.actionType}`,
};

export const TicTacToeGameProcessor = ticTacToeProcessorImplementation;


export const getCurrentPlayer = (gameState: TicTacToeGameState): GameTableSeat => {
  if (gameState.nextPlayersToAct.length !== 1) {
    throw new Error(`Invalid number of next players to act: ${gameState.nextPlayersToAct.length}`);
  }
  return gameState.nextPlayersToAct[0];
}

export const getPlayerSeatSymbol = (playerSeat: GameTableSeat) => {
  switch (playerSeat) {
    case "p1":
      return "X";
    case "p2":
      return "O";
    default:
      return "Observer";
  }
}
