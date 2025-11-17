import z from "zod";
// import { BfgGameActionByPlayerSchema, BfgGameActionHostOutcomeStrSchema, BfgGameActionPlayerOutcomeStrSchema, BfgGameActionPublicOutcomeStrSchema } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";
import { ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND, RockPaperScissorsPlayerChoiceSchema, ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE } from "./action-types";
// import { createPlayerActionDefinition, type PlayerActionDefinition } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-definition-types";
import type { RockPaperScissorsBfgGameSpecificPlayerActionOutcome, RockPaperScissorsHostGameState } from "../rock-paper-scissors-types";
import type { GameTable } from '@bfg-engine/models/game-table/game-table';
// import { ALL_PLAYER_SEATS } from "../../../../../bfg-engine/src/models/game-table/game-table";
// import type { BfgGameActionHostOutcomeStr, BfgGameActionPlayerOutcomeStr, BfgGameActionPublicOutcomeStr } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";
import { BfgGameActionByPlayerSchema } from '@bfg-engine/game-metadata/metadata-types/game-action-types';
import type { GameTableSeatId } from '@bfg-engine/models/types/bfg-branded-ids';
import { BfgGameActionHostOutcomeStrToolbox, BfgGameActionWatcherOutcomeStrToolbox } from "@bfg-engine/models/types/bfg-branded-string-types";
import type { BfgGameActionHostOutcomeStr, BfgGameActionPlayerOutcomeStr, BfgGameActionWatcherOutcomeStr } from "@bfg-engine/models/types/bfg-branded-string-types";
import type { RpsPlayerSeatSummaries } from "../rock-paper-scissors-types";
// import type { BfgGameActionPlayerOutcomeStr } from "../../../../../bfg-engine/src/models/types/bfg-branded-string-utils";


// Player action to ask another player for cards
export const RockPaperScissorsPlayerActionSetHandSchema = BfgGameActionByPlayerSchema.extend({
  actionType: z.literal(ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND),
  choice: RockPaperScissorsPlayerChoiceSchema,
}).describe('RockPaperScissorsPlayerActionSetHand');

export type RockPaperScissorsPlayerActionSetHand = z.infer<typeof RockPaperScissorsPlayerActionSetHandSchema>;


export const RockPaperScissorsPlayerActionConcedeSchema = BfgGameActionByPlayerSchema.extend({
  actionType: z.literal(ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE),
}).describe('RockPaperScissorsPlayerActionConcede');

export type RockPaperScissorsPlayerActionConcede = z.infer<typeof RockPaperScissorsPlayerActionConcedeSchema>;


export const AnyRockPaperScissorsPlayerActionSchema = z.union([
  RockPaperScissorsPlayerActionSetHandSchema,
  RockPaperScissorsPlayerActionConcedeSchema,
]);
  
export type AnyRockPaperScissorsPlayerAction = z.infer<typeof AnyRockPaperScissorsPlayerActionSchema>;


// export const AllRockPaperScissorsPlayerActionsSchema = z.array(AnyRockPaperScissorsPlayerActionSchema);
// export type AllRockPaperScissorsPlayerActions = z.infer<typeof AllRockPaperScissorsPlayerActionsSchema>;



export const buildPlayerSeatSummaries = (
  _activeSeat: GameTableSeatId,
  p1Message: BfgGameActionPlayerOutcomeStr,
  p2Message: BfgGameActionPlayerOutcomeStr
): RpsPlayerSeatSummaries => {
  const retVal: RpsPlayerSeatSummaries = {
    p1: p1Message,
    p2: p2Message,
  };
  return retVal;

  // return ALL_PLAYER_SEATS.reduce<RpsPlayerSeatSummaries>((acc, seat) => {
  //   const summary = seat === activeSeat ? activeSeatMessage : otherSeatMessage;
  //   acc[seat] = summary;
  //   return acc;
  // }, {} as RpsPlayerSeatSummaries);
};

const toWatcherOutcome = (message: string): BfgGameActionWatcherOutcomeStr => 
  BfgGameActionWatcherOutcomeStrToolbox.createBrandedString(message);

const toHostOutcome = (message: string): BfgGameActionHostOutcomeStr => 
  BfgGameActionHostOutcomeStrToolbox.createBrandedString(message);


export const handleRockPaperScissorsPlayerActionSetHand = async (
  _tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  playerAction: RockPaperScissorsPlayerActionSetHand
): Promise<RockPaperScissorsBfgGameSpecificPlayerActionOutcome> => {
  const playerSeat = playerAction.playerSeat;
  const updatedGameState: RockPaperScissorsHostGameState = {
    ...gameState,
    ...(playerSeat === "p1"
      ? {
          p1Choice: playerAction.choice,
          p1Showing: "hidden" as const,
        }
      : {}),
    ...(playerSeat === "p2"
      ? {
          p2Choice: playerAction.choice,
          p2Showing: "hidden" as const,
        }
      : {}),
  };

  const watcherSummary = toWatcherOutcome(`Player ${playerSeat} locked in a hand.`);
  const hostSummary = toHostOutcome(`Player ${playerSeat} set hand: ${playerAction.choice}`);
  const playerSeatSummaries = buildPlayerSeatSummaries(
    playerSeat,
    toWatcherOutcome(`You locked in ${playerAction.choice}.`),
    toWatcherOutcome(`Player ${playerSeat} locked in a hand.`)
  );

  const retVal: RockPaperScissorsBfgGameSpecificPlayerActionOutcome = {
    updatedGameState,
    watcherSummary,
    playerSeatSummaries,
    hostSummary,
    nextActions: null,
  };

  return retVal;
};

export const handleRockPaperScissorsPlayerActionConcede = async (
  _tableState: GameTable,
  gameState: RockPaperScissorsHostGameState,
  playerAction: RockPaperScissorsPlayerActionConcede
): Promise<RockPaperScissorsBfgGameSpecificPlayerActionOutcome> => {
  const playerSeat = playerAction.playerSeat;

  const watcherSummary = toWatcherOutcome(`Player ${playerSeat} conceded.`);
  const hostSummary = toHostOutcome(`Player ${playerSeat} conceded.`);
  const playerSeatSummaries = buildPlayerSeatSummaries(
    playerSeat,
    toWatcherOutcome("You conceded the game."),
    toWatcherOutcome(`Player ${playerSeat} conceded the game.`)
  );

  const retVal: RockPaperScissorsBfgGameSpecificPlayerActionOutcome = {
    updatedGameState: gameState,
    watcherSummary,
    playerSeatSummaries,
    hostSummary,
    nextActions: null,
  };

  return retVal;
};


// export interface PlayerActionMap {
//   [ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND]: (x: RockPaperScissorsPlayerActionSetHand) => BfgGameSpecificPlayerActionOutcome;
//   [ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE]: (x: RockPaperScissorsPlayerActionConcede) => BfgGameSpecificPlayerActionOutcome;
// }

// type PlayerActionNames = keyof PlayerActionMap;

// // export type RpsHostActionMap = {

// // }

// export type RpsPlayerActionHandlerMap = {
//   // [Name in HostActionNames]: HostActionHandler<RockPaperScissorsHostAction>;
//   [Name in PlayerActionNames]: PlayerActionMap[Name];
// }

// export const RpsPlayerActionHandlerMapImpl: RpsPlayerActionHandlerMap = {
//   [ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND]: handleRockPaperScissorsPlayerActionSetHand,
//   [ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE]: handleRockPaperScissorsPlayerActionConcede,
// }


// const RockPaperScissorsPlayerActionSetHandDefinition = createPlayerActionDefinition<
//   RockPaperScissorsHostGameState,
//   // RockPaperScissorsPlayerActionSetHandSchema,
//   RockPaperScissorsBfgGameSpecificPlayerActionOutcome
// >(
//   RockPaperScissorsPlayerActionSetHandSchema,
//   async (_tableState, gameState, _action) => gameState,
//   async (tableState, gameState, action) =>
//     handleRockPaperScissorsPlayerActionSetHand(tableState, gameState, action as RockPaperScissorsPlayerActionSetHand)
// );


// const RockPaperScissorsPlayerActionConcedeDefinition = createPlayerActionDefinition<
//   RockPaperScissorsHostGameState,
//   // RockPaperScissorsPlayerActionConcede,
//   RockPaperScissorsBfgGameSpecificPlayerActionOutcome
//   // RockPaperScissorsPlayerActionConcede
// >(
//   RockPaperScissorsPlayerActionConcedeSchema,
//   async (_tableState, gameState, _action) => gameState,
//   async (tableState, gameState, action) =>
//     handleRockPaperScissorsPlayerActionConcede(tableState, gameState, action as RockPaperScissorsPlayerActionConcede)
// );

// const RockPaperScissorsPlayerActionConcede = BfgGameActionByPlayerSchema.extend({
//   actionType: z.literal(ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE),
// }).describe('RockPaperScissorsPlayerActionConcede');

// export type RockPaperScissorsPlayerActionConcede = z.infer<typeof RockPaperScissorsPlayerActionConcede>;


// export const RockPaperScissorsPlayerActionDefinitions: ReadonlyArray<PlayerActionDefinition>
//     // z.infer<RockPaperScissorsHostGameStateSchema>,
//     // z.infer<RockPaperScissorsPlayerActionSetHandSchema>,
//     // z.infer<BfgGameSpecificPlayerActionOutcomeSchema>>
// = [
//   RockPaperScissorsPlayerActionSetHandDefinition,
//   RockPaperScissorsPlayerActionConcedeDefinition,
// ];

// export const RockPaperScissorsPlayerActionDefinitions: ReadonlyArray<
//   PlayerActionDefinition<
//     RockPaperScissorsHostGameState,
//     RockPaperScissorsBfgGameSpecificPlayerActionOutcome
//   >
// > = [
//   RockPaperScissorsPlayerActionSetHandDefinition,
//   RockPaperScissorsPlayerActionConcedeDefinition,
// ] as const;




// export const createPlayerActionDefinitions = () => {
//   return {
//     playerActionDefinitions: RockPaperScissorsPlayerActionDefinitions,
//   };
// };