import { RockPaperScissorsCompleteGameProcessor } from "./engine/rock-paper-scissors-engine";
import { RockPaperScissorsGameName } from "./engine/rock-paper-scissors-engine";
import type { GameDefinition } from "@bfg-engine/models/game-box-definition";
import {
  RockPaperScissorsHostGameStateSchema,
  RockPaperScissorsPlayerGameStateSchema,
  RockPaperScissorsWatcherGameStateSchema,
  type RockPaperScissorsHostGameState,
  type RockPaperScissorsPlayerGameState,
  type RockPaperScissorsWatcherGameState,
} from "./rock-paper-scissors-types";
import { RpsGameSpineComponent, RpsHistoryComponent, RpsHostComponent, RpsObserverComponent, RpsPlayerComponent } from "./ui/components";
// import { type BfgEngineMetadataSchemas, type IBfgGameCompleteMetadata } from "../../../../bfg-engine/src/game-metadata/metadata-types";
// import { createCompleteGameProcessor } from "../../../../bfg-engine/src/game-metadata/factories/complete-game-processor-factory";
// import { type IBfgGameEngineAccessLevelConverters, type IBfgGameEngineComponents, type PlayerSeatGameState } from "../../../../bfg-engine/src/game-metadata/ui/bfg-game-components";
// import { ALL_PLAYER_SEATS, type GameTable, type GameTableSeat } from "../../../../bfg-engine/src/models/game-table/game-table";
// import { RockPaperScissorsGameEncoders } from "./engine/encoders";
import { createBfgEngineMetadataSchemas, type BfgGameEngineMetadata, type BfgGenericEngineMetadataSchemas } from "@bfg-engine/game-metadata/metadata-types";
import type { BfgGameEngineComponents } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { createBfgGameEngineAccessLevelAdapters } from "@bfg-engine/game-metadata/factories/game-access-level-adapter-factory";
import type { GameTableEventForHostP2p } from "@bfg-engine/models/game-table/game-table-event-p2p";
import type { GameBoardEventForDb } from "@bfg-engine/models/game-table/game-board-transition-db";



export const RockPaperScissorsGameDefinition: GameDefinition = {
  title: RockPaperScissorsGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2
};


// const RockPaperScissorsGameStateAccessTypes = createBfgMetadataGameStateAccessTypes(
//   RockPaperScissorsHostGameStateSchema,
//   RockPaperScissorsPlayerGameStateSchema,
//   RockPaperScissorsWatcherGameStateSchema,
// );


// const RockPaperScissorsPlayerActionDefinitions = createPlayerActionDefinitions();
// const x = RockPaperScissorsPlayerActionDefinitions;

// const RockPaperScissorsHostActionDefinitions = createHostActionDefinitions();




// const RockPaperScissorsCompleteGameProcessor = createCompleteGameProcessor(
//   RockPaperScissorsGameStateAccessTypes,

//   // rockPaperScissorsPlayerActionDefinitionsForHostState,
//   // rockPaperScissorsHostActionDefinitionsForHostState,

//   // RockPaperScissorsPlayerActionHandlers,
//   // RockPaperScissorsHostActionHandlers,
//   // RpsPlayerActionHandlerMapImpl,
//   // RpsPlayerActionHandlerMapImpl,
//   // RpsHostActionHandlerMapImpl,
//   RockPaperScissorsGameActionProcessor,

// );



// const RockPaperScissorsGameComponents: BfgGameEngineComponents<
//   typeof RockPaperScissorsHostGameStateSchema,
//   typeof RockPaperScissorsPlayerGameStateSchema,
//   typeof RockPaperScissorsWatcherGameStateSchema,
//   typeof BfgGameActionByPlayerSchema,
//   typeof BfgGameActionByHostSchema
// > = {
//   // ObserverComponent: RockPaperScissorsObserverComponent,
//   // PlayerComponent: RockPaperScissorsPlayerComponent,
//   // HostComponent: RockPaperScissorsHostComponent,
//   // HistoryComponent: RockPaperScissorsHistoryComponent,
//   ObserverComponent: RockPaperScissorsObserverComponent,
//   PlayerComponent: RockPaperScissorsPlayerComponent,
//   HostComponent: RockPaperScissorsHostComponent,
// };




// const RockPaperScissorsGameComponents = createBfgGameEngineComponents(
//   RockPaperScissorsGameStateAccessTypes,
//   RpsObserverComponent,
//   RpsPlayerComponent,
//   RpsHostComponent,
//   RpsHistoryComponent,
//   RpsGameSpineComponent,
// );

const RockPaperScissorsGameComponents: BfgGameEngineComponents
// <
//   RockPaperScissorsHostGameState,
//   RockPaperScissorsPlayerGameState,
//   RockPaperScissorsWatcherGameState,
//   RockPaperScissorsPlayerAction,
//   RockPaperScissorsHostAction
// >
= {
  ObserverComponent: RpsObserverComponent,
  PlayerComponent: RpsPlayerComponent,
  HostComponent: RpsHostComponent,
  HistoryComponent: RpsHistoryComponent,
  GameSpineComponent: RpsGameSpineComponent,
};



// export const RockPaperScissorsGameMetadata = createCompleteGameMetadata(
//   'private-player-knowledge-game',
//   RockPaperScissorsGameName,
//   RockPaperScissorsGameDefinition,
//   RockPaperScissorsGameStateAccessTypes,
//   RockPaperScissorsCompleteGameProcessor,
//   RockPaperScissorsGameComponents
// );


// const RockPaperScissorsGameSchemas: BfgGenericEngineMetadataSchemas
// // <
// //   RockPaperScissorsHostGameState,
// //   RockPaperScissorsPlayerGameState,
// //   RockPaperScissorsWatcherGameState
// // >
// = {
//   hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
//   playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
//   watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,

//   gameEventSchema: RockPaperScissorsGameEventSchema,
//   gameEventOutcomeSchema: RockPaperScissorsGameEventOutcomeSchema,
//   hostActionSchema: RockPaperScissorsHostActionSchema,
//   playerActionSchema: RockPaperScissorsPlayerActionSchema,

//   // playerActionSchemas: AllRockPaperScissorsPlayerActionSchemas,
//   // hostActionSchemas: AllRockPaperScissorsHostActionSchemas,
// };



const RockPaperScissorsGameSchemas = createBfgEngineMetadataSchemas({
  hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
  playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
  watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,

  // gameEventSchema: RockPaperScissorsGameEventSchema,
  // gameEventOutcomeSchema: RockPaperScissorsGameEventOutcomeSchema,
  // hostActionSchema: RockPaperScissorsHostActionSchema,
  // playerActionSchema: RockPaperScissorsPlayerActionSchema,
});


// const RockPaperScissorsGameSchemas: BfgGenericEngineMetadataSchemas = {
//   hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
//   playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
//   watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,

//   // gameEventSchema: RockPaperScissorsGameEventSchema,
//   // gameEventOutcomeSchema: RockPaperScissorsGameEventOutcomeSchema,
//   // hostActionSchema: RockPaperScissorsHostActionSchema,
//   // playerActionSchema: RockPaperScissorsPlayerActionSchema,
// };


// const RockPaperScissorsGameSchemas: BfgGenericEngineMetadataSchemas<
//   RockPaperScissorsHostGameState,
//   RockPaperScissorsPlayerGameState,
//   RockPaperScissorsWatcherGameState
// > = {
//   hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
//   playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
//   watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,
// }


// const RockPaperScissorsGameSchemas = {
//   hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
//   playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
//   watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,
// }


// export const createRockPaperScissorsGameAccessLevelAdapters = <
//   GSHSchema extends z.ZodType<BfgGameStateForHost>,
//   GSPSchema extends z.ZodType<BfgGameStateForPlayer>,
// >(
//   // schemas: BfgGenericEngineMetadataSchemas & {
//   schemas: {
//     hostGameStateSchema: GSHSchema;
//     playerGameStateSchema: GSPSchema;
//   },
//   {
//     myHostGameStateToPlayerAccessLevelAdapter,
//     // hostGameStateToWatcherAccessLevelAdapter,
//     // hostEventTransitionFromHostEventTransitionDb,
//     // hostEventTransitionToPlayerAccessLevelAdapter,
//     // hostEventTransitionToWatcherAccessLevelAdapter,
//   }: {
//     myHostGameStateToPlayerAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSPSchema>;
//     // hostGameStateToWatcherAccessLevelAdapter: (hostState: z.infer<GSHSchema>) => z.infer<GSWSchema>;
//     // hostEventTransitionFromHostEventTransitionDb: (hostEventTransitionDb: GameBoardEventForDb) => GameTableEventForHostP2p;
//     // hostEventTransitionToPlayerAccessLevelAdapter: (playerSeat: GameTableSeat, hostEventTransitionDb: GameBoardEventForDb) => GameTableEventForPlayerP2p;
//     // hostEventTransitionToWatcherAccessLevelAdapter: (hostEventTransition: GameBoardEventForDb) => GameTableEventForWatcherP2p;
//   }
// ) => {
//   const hostGameStateSchema = schemas.hostGameStateSchema;

//   type InferredGSH = z.infer<typeof hostGameStateSchema>;

//   return {
//     hostGameStateToPlayerAccessLevelAdapter: <
//       GSH extends BfgGameStateForHost,
//       GSP extends BfgGameStateForPlayer,
//     >(hostState: GSH): GSP => {
//       // Converting from generic GSH to specific InferredGSH for the adapter call
//       // This is safe because the function is only called with the specific types at runtime
//       const typedHostState = hostState as unknown as InferredGSH;
//       const result = myHostGameStateToPlayerAccessLevelAdapter(typedHostState);

//       // Converting from specific InferredGSP to generic GSP
//       // This is safe because the function is only called with the specific types at runtime
//       return result as unknown as GSP;
//     },
//     // hostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
//     //   const retVal: RockPaperScissorsPlayerGameState = {
//     //     myChoice: null,
//     //     p1WinCount: hostState.p1WinCount,
//     //     p2WinCount: hostState.p2WinCount,
//     //     tieCount: hostState.tieCount,
//     //   };

//     //   return retVal;
//     // },
//     // hostGameStateToPlayerAccessLevelAdapter,
//   };
// };

// createBfgGameEngineAccessLevelAdapters
// const RockPaperScissorsGameAccessLevelAdapters = createRockPaperScissorsGameAccessLevelAdapters(
const RockPaperScissorsGameAccessLevelAdapters = createBfgGameEngineAccessLevelAdapters({
  schemas: RockPaperScissorsGameSchemas,
  adapters: {
    myHostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
      const retVal: RockPaperScissorsPlayerGameState = {
        myChoice: null,
        p1WinCount: hostState.p1WinCount,
        p2WinCount: hostState.p2WinCount,
        tieCount: hostState.tieCount,
      };

      return retVal;
    },
    myHostGameStateToWatcherAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsWatcherGameState => {
      const retVal: RockPaperScissorsWatcherGameState = {
        ...hostState,
        p1Showing: hostState.p1Choice,
        p2Showing: hostState.p2Choice,
      };

      return retVal;
    },
    myHostEventTransitionFromHostEventTransitionDb: (hostEventTransitionDb: GameBoardEventForDb): GameTableEventForHostP2p => {
      return {
        ...hostEventTransitionDb,
        p1Choice: hostEventTransitionDb.p1Choice,
        p2Choice: hostEventTransitionDb.p2Choice,
      };
    },
  },
});

// export const RockPaperScissorsGameAccessLevelAdapters: IBfgGameEngineAccessLevelAdapters = {
//   hostGameStateToPlayerAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsPlayerGameState => {
//     const retVal: RockPaperScissorsPlayerGameState = {
//       myChoice: null,
//       p1WinCount: hostState.p1WinCount,
//       p2WinCount: hostState.p2WinCount,
//       tieCount: hostState.tieCount,
//     };
    
//     return retVal;
//   },
//   // hostGameStateToWatcherAccessLevelAdapter: (hostState: RockPaperScissorsHostGameState): RockPaperScissorsWatcherGameState => {
//   //   const retVal: RockPaperScissorsWatcherGameState = {
//   //     ...hostState,
//   //     p1Showing: hostState.p1Choice,
//   //     p2Showing: hostState.p2Choice,
//   //     p1WinCount: hostState.p1WinCount,
//   //     p2WinCount: hostState.p2WinCount,
//   //     tieCount: hostState.tieCount,
//   //   };
//   //   return retVal;
//   // },
//   // hostEventTransitionFromHostEventTransitionDb: (hostEventTransitionDb: GameBoardEventForDb) => {
//   //   return {
//   //     ...hostEventTransitionDb,
//   //     p1Choice: hostEventTransitionDb.p1Choice,
//   //     p2Choice: hostEventTransitionDb.p2Choice,
//   //   };
//   // },
//   // hostEventTransitionToPlayerAccessLevelAdapter: (playerSeat: GameTableSeat, hostEventTransitionDb: GameBoardEventForDb) => {
//   //   return {
//   //     ...hostEventTransitionDb,
//   //     p1Choice: hostEventTransitionDb.p1Choice,
//   //     p2Choice: hostEventTransitionDb.p2Choice,
//   //   };
//   // },
//   // hostEventTransitionToWatcherAccessLevelAdapter: (hostEventTransition: GameBoardEventForDb) => {
//   //   return {
//   //     ...hostEventTransition,
//   //     p1Choice: hostEventTransition.p1Choice,
//   //     p2Choice: hostEventTransition.p2Choice,
//   //   };
//   // },
// }



export const RockPaperScissorsGameMetadata: BfgGameEngineMetadata
// <
//   RockPaperScissorsHostGameState,
//   RockPaperScissorsPlayerGameState,
//   RockPaperScissorsWatcherGameState,
//   RockPaperScissorsPlayerAction,
//   RockPaperScissorsHostAction
//   // RockPaperScissorsPlayerActionsUnion,
// > 
= {
  metadataType: 'private-player-knowledge-game',
  gameTitle: RockPaperScissorsGameName,
  definition: RockPaperScissorsGameDefinition,
  // gameStateAccessTypes: RockPaperScissorsGameStateAccessTypes,

  schemas: RockPaperScissorsGameSchemas,
  // encoders: RockPaperScissorsGameEncoders,
  accessLevelAdapters: RockPaperScissorsGameAccessLevelAdapters,
  
  gameProcessor: RockPaperScissorsCompleteGameProcessor,
  components: RockPaperScissorsGameComponents,
};
