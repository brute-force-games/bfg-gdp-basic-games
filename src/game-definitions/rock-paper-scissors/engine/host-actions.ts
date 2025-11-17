import { z } from 'zod'
import { ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER, ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER, ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME } from './action-types';
// import { BfgGameActionByHostSchema, BfgGameActionHostOutcomeStrSchema, BfgGameActionPublicOutcomeStrSchema, type BfgGameActionHostOutcomeStr, type BfgGameActionPublicOutcomeStr } from '../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types';
// import { createHostActionDefinition } from '../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-definition-types';
import type { RockPaperScissorsBfgGameSpecificHostActionOutcome, RockPaperScissorsHostGameState, RpsPlayerSeatSummaries } from '../rock-paper-scissors-types';
import type { GameTable } from '@bfg-engine/models/game-table/game-table';
import { buildPlayerSeatSummaries } from './player-actions';
import { BfgGameActionByHostSchema } from '@bfg-engine/game-metadata/metadata-types/game-action-types';
import type { GameTableSeatId } from '@bfg-engine/models/types/bfg-branded-ids';


export const RockPaperScissorsHostActionStartGameSchema = BfgGameActionByHostSchema.extend({
  actionType: z.literal(ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME),
});

export type RockPaperScissorsHostActionStartGame = z.infer<typeof RockPaperScissorsHostActionStartGameSchema>;


export const RockPaperScissorsHostActionCallRoundWinnerSchema = BfgGameActionByHostSchema.extend({
  actionType: z.literal(ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER),
});

export type RockPaperScissorsHostActionCallRoundWinner = z.infer<typeof RockPaperScissorsHostActionCallRoundWinnerSchema>;


export const RockPaperScissorsHostActionCallGameWinnerSchema = BfgGameActionByHostSchema.extend({
  actionType: z.literal(ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER),
});

export type RockPaperScissorsHostActionCallGameWinner = z.infer<typeof RockPaperScissorsHostActionCallGameWinnerSchema>;


// export const AllRockPaperScissorsHostActionSchemas = [
//   RockPaperScissorsHostActionStartGameSchema,
//   RockPaperScissorsHostActionCallRoundWinnerSchema,
//   RockPaperScissorsHostActionCallGameWinnerSchema,
// ] as const;
// export type AllRockPaperScissorsHostActions = typeof AllRockPaperScissorsHostActionSchemas;


export const AnyRockPaperScissorsHostActionSchema = z.union([
  RockPaperScissorsHostActionStartGameSchema,
  RockPaperScissorsHostActionCallRoundWinnerSchema,
  RockPaperScissorsHostActionCallGameWinnerSchema,
]);

export type AnyRockPaperScissorsHostAction = z.infer<typeof AnyRockPaperScissorsHostActionSchema>;

export const AllRockPaperScissorsHostActionsSchema = z.array(AnyRockPaperScissorsHostActionSchema);
export type AllRockPaperScissorsHostActions = z.infer<typeof AllRockPaperScissorsHostActionsSchema>;


// export type RpsPlayerSeatSummaries = {
//   [PlayerSeat1]: BfgGameActionPlayerOutcomeStr;
//   [PlayerSeat2]: BfgGameActionPlayerOutcomeStr;
// }



// export const AnyRockPaperScissorsPlayerActionSchema = z.union([
//   RockPaperScissorsPlayerActionSetHandSchema,
//   RockPaperScissorsPlayerActionConcedeSchema,
// ]);
  
// export type AnyRockPaperScissorsPlayerAction = z.infer<typeof AnyRockPaperScissorsPlayerActionSchema>;


// export const AllRockPaperScissorsPlayerActionsSchema = z.array(AnyRockPaperScissorsPlayerActionSchema);
// export type AllRockPaperScissorsPlayerActions = z.infer<typeof AllRockPaperScissorsPlayerActionsSchema>;



// export const handleRockPaperScissorsHostAction = (hostAction: AnyRockPaperScissorsHostAction) => {
//   switch (hostAction.actionType) {
//     case ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME:
//       return handleRockPaperScissorsHostActionStartGame(hostAction);
//     case ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER:
//       return handleRockPaperScissorsHostActionCallRoundWinner(hostAction);
//     case ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER:
//       return handleRockPaperScissorsHostActionCallGameWinner(hostAction);
//   }
// };

export const handleRockPaperScissorsHostActionStartGame = (
  _tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  _hostAction: RockPaperScissorsHostActionStartGame
): RockPaperScissorsBfgGameSpecificHostActionOutcome => {

  const retVal: RockPaperScissorsBfgGameSpecificHostActionOutcome = {
    source: 'host',
    updatedGameState: gameState,
    // watcherSummary: "Host started the game." as BfgGameActionWatcherOutcomeStr,
    // playerSeatSummaries: buildPlayerSeatSummaries("p1" as GameTableSeatId, "You started the game.", "Player 1 started the game."),
    // hostSummary: "Host started the game." as BfgGameActionHostOutcomeStr,
    // nextActions: null,
  };

  return retVal;

  // return {
  //   updatedGameState: gameState,
  //   watcherSummary: "Host started the game." as BfgGameActionWatcherOutcomeStr,
  //   playerSeatSummaries: buildPlayerSeatSummaries("p1" as GameTableSeatId, "You started the game.", "Player 1 started the game."),
  //   hostSummary: "Host started the game." as BfgGameActionHostOutcomeStr,
  //   nextActions: null,
  // } as RockPaperScissorsBfgGameSpecificHostActionOutcome;
};

// const toPublicOutcome = (message: string): BfgGameActionWatcherOutcomeStr =>
//   BfgGameActionWatcherOutcomeStrToolbox.createBrandedString(message);

// const toHostOutcome = (message: string): BfgGameActionHostOutcomeStr =>
//   BfgGameActionHostOutcomeStrToolbox.createBrandedString(message);

type RoundResult = 'p1' | 'p2' | 'tie';

const determineRoundResult = (
  p1Choice: RockPaperScissorsHostGameState['p1Choice'],
  p2Choice: RockPaperScissorsHostGameState['p2Choice']
): RoundResult => {
  if (p1Choice === p2Choice) {
    return 'tie';
  }

  if (
    (p1Choice === 'rock' && p2Choice === 'scissors') ||
    (p1Choice === 'paper' && p2Choice === 'rock') ||
    (p1Choice === 'scissors' && p2Choice === 'paper')
  ) {
    return 'p1';
  }

  return 'p2';
};

export const handleRockPaperScissorsHostActionCallRoundWinner = (
  _tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  _hostAction: RockPaperScissorsHostActionCallRoundWinner
): RockPaperScissorsBfgGameSpecificHostActionOutcome => {
  const roundResult = determineRoundResult(gameState.p1Choice, gameState.p2Choice);

  const updatedGameState: RockPaperScissorsHostGameState = {
    ...gameState,
    p1Showing: gameState.p1Choice,
    p2Showing: gameState.p2Choice,
    p1WinCount: roundResult === 'p1' ? gameState.p1WinCount + 1 : gameState.p1WinCount,
    p2WinCount: roundResult === 'p2' ? gameState.p2WinCount + 1 : gameState.p2WinCount,
    tieCount: roundResult === 'tie' ? gameState.tieCount + 1 : gameState.tieCount,
  };

  if (roundResult === 'p1') {
    return {
      updatedGameState,
      // watcherSummary: toPublicOutcome(`Player 1 wins the round with ${gameState.p1Choice} over ${gameState.p2Choice}.`),
      // playerSeatSummaries: buildPlayerSeatSummaries(
      //   'p1' as GameTableSeatId,
      //   `You win the round with ${gameState.p1Choice}.`,
      //   `Player 1 wins the round with ${gameState.p1Choice}.`
      // ),
      // hostSummary: toHostOutcome(`Round result: Player 1 wins with ${gameState.p1Choice} over ${gameState.p2Choice}.`),
      // nextActions: null,
    } as RockPaperScissorsBfgGameSpecificHostActionOutcome;
  }

  if (roundResult === 'p2') {
    return {
      updatedGameState,
      // watcherSummary: toPublicOutcome(`Player 2 wins the round with ${gameState.p2Choice} over ${gameState.p1Choice}.`),
      // playerSeatSummaries: buildPlayerSeatSummaries(
      //   'p2' as GameTableSeatId,
      //   `You win the round with ${gameState.p2Choice}.`,
      //   `Player 2 wins the round with ${gameState.p2Choice}.`
      // ),
      // hostSummary: toHostOutcome(`Round result: Player 2 wins with ${gameState.p2Choice} over ${gameState.p1Choice}.`),
      // nextActions: null,
    } as RockPaperScissorsBfgGameSpecificHostActionOutcome;
  }

  return {
    updatedGameState,
    // watcherSummary: toPublicOutcome(`Round ends in a tie. Both players chose ${gameState.p1Choice}.`),
    // playerSeatSummaries: buildPlayerSeatSummaries(
    //   'p1' as GameTableSeatId,
    //   `Round ties. Both players revealed ${gameState.p1Choice}.`,
    //   `Round ties. Both players revealed ${gameState.p1Choice}.`
    // ),
    // hostSummary: toHostOutcome(`Round result: tie with both players showing ${gameState.p1Choice}.`),
    // nextActions: null,
  } as RockPaperScissorsBfgGameSpecificHostActionOutcome;
};


export const handleRockPaperScissorsHostActionCallGameWinner = (
  _tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  _hostAction: RockPaperScissorsHostActionCallGameWinner
): RockPaperScissorsBfgGameSpecificHostActionOutcome => {
  // const watcherSummary: BfgGameActionWatcherOutcomeStr = gameState.p1WinCount > gameState.p2WinCount
  //   ? toPublicOutcome(
  //       `Host declares Player 1 the game winner (${gameState.p1WinCount}-${gameState.p2WinCount} with ${gameState.tieCount} ties).`
  //     )
  //   : gameState.p2WinCount > gameState.p1WinCount
  //     ? toPublicOutcome(
  //         `Host declares Player 2 the game winner (${gameState.p2WinCount}-${gameState.p1WinCount} with ${gameState.tieCount} ties).`
  //       )
  //     : toPublicOutcome(
  //         `Host declares the game a tie (${gameState.p1WinCount}-${gameState.p2WinCount} with ${gameState.tieCount} ties).`
  //       );

  // const hostSummary: BfgGameActionHostOutcomeStr = gameState.p1WinCount > gameState.p2WinCount
  //   ? toHostOutcome(
  //       `Game winner called: Player 1 (${gameState.p1WinCount}-${gameState.p2WinCount}, ties: ${gameState.tieCount}).`
  //     )
  //   : gameState.p2WinCount > gameState.p1WinCount
  //     ? toHostOutcome(
  //         `Game winner called: Player 2 (${gameState.p2WinCount}-${gameState.p1WinCount}, ties: ${gameState.tieCount}).`
  //       )
  //     : toHostOutcome(
  //         `Game winner called: tie (${gameState.p1WinCount}-${gameState.p2WinCount}, ties: ${gameState.tieCount}).`
  //       );

  const playerSeatSummaries: RpsPlayerSeatSummaries = buildPlayerSeatSummaries(
    gameState.p1WinCount >= gameState.p2WinCount ? 
      'p1' as GameTableSeatId :
      'p2' as GameTableSeatId,
    gameState.p1WinCount === gameState.p2WinCount
      ? 'Game ends in a tie.'
      : 'You are declared the game winner!',
    gameState.p1WinCount === gameState.p2WinCount
      ? 'Game ends in a tie.'
      : 'Opponent is declared the game winner.'
  );

  if (gameState.p1WinCount === gameState.p2WinCount) {
    playerSeatSummaries.p2 = playerSeatSummaries.p1;
  }

  return {
    updatedGameState: gameState,
    // watcherSummary,
    // playerSeatSummaries,
    // hostSummary,
    // nextActions: null,
  } as RockPaperScissorsBfgGameSpecificHostActionOutcome;
};


// export const RockPaperScissorsHostActionDefinitions = [
//   createHostActionDefinition<
//     RockPaperScissorsHostGameState,
//     RockPaperScissorsHostActionStartGame,
//     RockPaperScissorsBfgGameSpecificHostActionOutcome
//   >(
//     RockPaperScissorsHostActionStartGameSchema,
//     async (_tableState, gameState, _action) => gameState,
//     async (tableState, gameState, action) =>
//       handleRockPaperScissorsHostActionStartGame(tableState, gameState, action)
//   ),
//   createHostActionDefinition<
//     RockPaperScissorsHostGameState,
//     RockPaperScissorsHostActionCallRoundWinner,
//     RockPaperScissorsBfgGameSpecificHostActionOutcome
//   >(
//     RockPaperScissorsHostActionCallRoundWinnerSchema,
//     async (_tableState, gameState, _action) => gameState,
//     async (tableState, gameState, action) =>
//       handleRockPaperScissorsHostActionCallRoundWinner(
//         tableState,
//         gameState,
//         action
//       )
//   ),
//   createHostActionDefinition<
//     RockPaperScissorsHostGameState,
//     RockPaperScissorsHostActionCallGameWinner,
//     RockPaperScissorsBfgGameSpecificHostActionOutcome
//   >(
//     RockPaperScissorsHostActionCallGameWinnerSchema,
//     async (_tableState, gameState, _action) => gameState,
//     async (tableState, gameState, action) =>
//       handleRockPaperScissorsHostActionCallGameWinner(
//         tableState,
//         gameState,
//         action
//       )
//   ),
// ] as const;






// export type HostActionKeys = z.infer<AnyRockPaperScissorsHostActionSchema[number]>['actionType'];
// type HostActionHandlers = Record<HostActionKeys, HostActionHandler<AllRockPaperScissorsHostActionSchemas[number]>>;

// const hostActionHandlers: HostActionHandler<RockPaperScissorsHostAction>[] = [
//   (hostAction: RockPaperScissorsHostActionStartGame) => handleRockPaperScissorsHostActionStartGame(hostAction),
//   (hostAction: RockPaperScissorsHostActionCallRoundWinner) => handleRockPaperScissorsHostActionCallRoundWinner(hostAction),
//   (hostAction: RockPaperScissorsHostActionCallGameWinner) => handleRockPaperScissorsHostActionCallGameWinner(hostAction),
// ];

// const xhostActionHandlers = {
//   RockPaperScissorsHostActionStartGameSchema: handleRockPaperScissorsHostActionStartGame(hostAction),
//   RockPaperScissorsHostActionCallRoundWinnerSchema: handleRockPaperScissorsHostActionCallRoundWinner(hostAction),
//   RockPaperScissorsHostActionCallGameWinnerSchema: handleRockPaperScissorsHostActionCallGameWinner(hostAction),
// }

// const createHostActionHandler = <HostAction extends BfgGameActionByHost>(
//   // hostActionSchema: z.ZodType<HostAction>,
//   handler: HostActionHandler<HostAction>
// ): HostActionHandler<HostAction> => {
//   return (hostAction: HostAction) => {
//     // hostActionSchema.parse(hostAction);
//     return handler(hostAction);
//   };
// };

// const startGameHandler = createHostActionHandler(
//   // RockPaperScissorsHostActionStartGameSchema,
//   (hostAction: RockPaperScissorsHostActionStartGame) => {
//     return handleRockPaperScissorsHostActionStartGame(hostAction);
//   }
// );

// const callRoundWinnerHandler = createHostActionHandler(
//   (hostAction: RockPaperScissorsHostActionCallRoundWinner) => {
//     return handleRockPaperScissorsHostActionCallRoundWinner(hostAction);
//   }
// );

// const callGameWinnerHandler = createHostActionHandler(
//   (hostAction: RockPaperScissorsHostActionCallGameWinner) => {
//     return handleRockPaperScissorsHostActionCallGameWinner(hostAction);
//   }
// );

// const hostActionHandlers = [
//   startGameHandler,
//   callRoundWinnerHandler,
//   callGameWinnerHandler,
// ];

// const handleHostAction = (hostAction: AnyRockPaperScissorsHostAction) => {
//   const hostActionHandler = hostActionHandlers.find(h => 
//     h.actionType === hostAction.actionType);
//   if (!hostActionHandler) {
//     throw new Error(`No host action handler found for action type: ${hostAction.actionType}`);
//   }
//   return hostActionHandler(hostAction);
//   // return hostActionHandlers.find((handler) => handler.actionType === hostAction.actionType)?.(hostAction);
// };

// const callRoundWinnerHandler = createHostActionHandler(
//   RockPaperScissorsHostActionCallRoundWinnerSchema,
//   handleRockPaperScissorsHostActionCallRoundWinner
// );

// const callGameWinnerHandler = createHostActionHandler(
//   RockPaperScissorsHostActionCallGameWinnerSchema,
//   handleRockPaperScissorsHostActionCallGameWinner
// );


// export interface HostActionMap<HostAction extends BfgGameActionByHost> {
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME }>;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER }>;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER }>;
// }

// export interface HostActionMap2<HostAction extends BfgGameActionByHost> {
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME }>;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER }>;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER }>;
// }

// export const RpsHostActionMap: HostActionMap<RockPaperScissorsHostAction> = {
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: async (hostAction) => {
//     return handleRockPaperScissorsHostActionStartGame(hostAction);
//   },
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: async (hostAction) => {
//     return handleRockPaperScissorsHostActionCallRoundWinner(hostAction);
//   },
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: async (hostAction) => {
//     return handleRockPaperScissorsHostActionCallGameWinner(hostAction);
//   },
// };



// export interface HostActionMap {
//   // [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME }>;
//   // [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER }>;
//   // [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: HostActionHandler<HostAction & { actionType: typeof ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER }>;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: (x: RockPaperScissorsHostActionStartGame) => BfgGameSpecificHostActionOutcome;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: (x: RockPaperScissorsHostActionCallRoundWinner) => BfgGameSpecificHostActionOutcome;
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: (x: RockPaperScissorsHostActionCallGameWinner) => BfgGameSpecificHostActionOutcome;
// }

// export type RpsHostActionMap = {

// }

// export type RpsHostActionHandlerMap = {
//   // [Name in HostActionNames]: HostActionHandler<RockPaperScissorsHostAction>;
//   [Name in HostActionNames]: HostActionMap[Name];
// }

// export const RpsHostActionHandlerMapImpl: RpsHostActionHandlerMap = {
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME]: handleRockPaperScissorsHostActionStartGame,
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER]: handleRockPaperScissorsHostActionCallRoundWinner,
//   [ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER]: handleRockPaperScissorsHostActionCallGameWinner,
// }


// export interface ButtonEventMap {
//   click: ClickEventInfo
//   hover: HoverEventInfo
//   mount: {}
// }

// type ButtonEventNames = keyof ButtonEventMap

// type ButtonEventHandlerMap = {
//   [Name in ButtonEventNames]: Handler<
//       ButtonEventMap[Name]
//   >
// }


// export type HostActionMapKeys<HostActionType extends BfgGameActionByHost['actionType']> = keyof HostActionMap<HostActionType>;

// export type HostActionHandlerMap<HostActionType extends BfgGameActionByHost['actionType']> = {
//   [Name in HostActionType]: HostActionHandler<HostAction & { actionType: HostActionType }>;
// }


// export const createHostActionDefinitions = () => {
//   return {
//     hostActionDefinitions: [
//       createHostActionDefinition(
//         RockPaperScissorsHostActionStartGameSchema,
//         handleRockPaperScissorsHostActionStartGame
//       ),
//       createGameActionDefinition(RockPaperScissorsHostActionCallRoundWinnerSchema, handleRockPaperScissorsHostActionCallRoundWinner),
//       createGameActionDefinition(RockPaperScissorsHostActionCallGameWinnerSchema, handleRockPaperScissorsHostActionCallGameWinner),
//     ],
//   };
// };
