// import type { HostActionHandler, PlayerActionHandler } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";
// import { ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER, ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER, ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME, ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE, ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND } from "./action-types";
// import type { RockPaperScissorsHostAction, RockPaperScissorsPlayerAction } from "../rock-paper-scissors-types";
// import { handleRockPaperScissorsHostActionCallGameWinner, handleRockPaperScissorsHostActionCallRoundWinner, handleRockPaperScissorsHostActionStartGame } from "./host-actions";
// import { handleRockPaperScissorsPlayerActionConcede, handleRockPaperScissorsPlayerActionSetHand } from "./player-actions";


// export const RockPaperScissorsPlayerActionHandlers: ReadonlyArray<{
//   actionType: RockPaperScissorsPlayerAction['actionType'];
//   handler: PlayerActionHandler<RockPaperScissorsPlayerAction>;
// }> = [
//   {
//     actionType: ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND,
//     handler: async (playerAction) => {
//       if (playerAction.actionType !== ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND) {
//         throw new Error(`Unexpected player action: ${playerAction.actionType}`);
//       }

//       const retVal = handleRockPaperScissorsPlayerActionSetHand(playerAction);
//       return retVal;
//     },
//   },
//   {
//     actionType: ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE,
//     handler: async (playerAction) => {
//       if (playerAction.actionType !== ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE) {
//         throw new Error(`Unexpected player action: ${playerAction.actionType}`);
//       }

//       const retVal = handleRockPaperScissorsPlayerActionConcede(playerAction);
//       return retVal;
//     },
//   },
// ];


// export const RockPaperScissorsHostActionHandlers: ReadonlyArray<{
//   actionType: RockPaperScissorsHostAction['actionType'];
//   handler: HostActionHandler<RockPaperScissorsHostAction>;
// }> = [
//   {
//     actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME,
//     handler: async (hostAction) => {

//       if (hostAction.actionType !== ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME) {
//         throw new Error(`Unexpected host action: ${hostAction.actionType}`);
//       }

//       // const retVal = await RpsHostActionHandlerMap[ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME](hostAction);
//       const retVal = handleRockPaperScissorsHostActionStartGame(hostAction);
//       return retVal;
//     },
//   },
//   {
//     actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER,
//     handler: async (hostAction) => {
//       if (hostAction.actionType !== ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER) {
//         throw new Error(`Unexpected host action: ${hostAction.actionType}`);
//       }
//       const retVal = handleRockPaperScissorsHostActionCallRoundWinner(hostAction);
//       return retVal;
//     },
//   },
//   {
//     actionType: ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER,
//     handler: async (hostAction) => {
//       if (hostAction.actionType !== ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER) {
//         throw new Error(`Unexpected host action: ${hostAction.actionType}`);
//       }
//       const retVal = handleRockPaperScissorsHostActionCallGameWinner(hostAction);
//       return retVal;
//     },
//   },
// ];

