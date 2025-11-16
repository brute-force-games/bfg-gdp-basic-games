import { RockPaperScissorsCompleteGameProcessor } from "./engine/rock-paper-scissors-engine";
import { RockPaperScissorsGameName } from "./engine/rock-paper-scissors-engine";
import type { GameDefinition } from "../../../../bfg-engine/src/models/game-box-definition";
import {
  RockPaperScissorsHostGameStateSchema,
  RockPaperScissorsPlayerGameStateSchema,
  RockPaperScissorsWatcherGameStateSchema,
  type RockPaperScissorsHostAction,
  type RockPaperScissorsHostGameState,
  type RockPaperScissorsPlayerAction,
  type RockPaperScissorsPlayerGameState,
  type RockPaperScissorsWatcherGameState,
} from "./rock-paper-scissors-types";
import { type BfgEngineMetadataSchemas, type IBfgGameCompleteMetadata } from "../../../../bfg-engine/src/game-metadata/metadata-types";
// import { createCompleteGameProcessor } from "../../../../bfg-engine/src/game-metadata/factories/complete-game-processor-factory";
import { type IBfgGameEngineAccessLevelConverters, type IBfgGameEngineComponents, type PlayerSeatGameState } from "../../../../bfg-engine/src/game-metadata/ui/bfg-game-components";
import { RpsGameSpineComponent, RpsHistoryComponent, RpsHostComponent, RpsObserverComponent, RpsPlayerComponent } from "./ui/components";
import { ALL_PLAYER_SEATS, type GameTable, type GameTableSeat } from "../../../../bfg-engine/src/models/game-table/game-table";
import { RockPaperScissorsGameEncoders } from "./engine/encoders";
import type { RockPaperScissorsPlayerChoice } from "./engine/action-types";



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

const RockPaperScissorsGameComponents: IBfgGameEngineComponents<
  RockPaperScissorsHostGameState,
  RockPaperScissorsPlayerGameState,
  RockPaperScissorsWatcherGameState,
  RockPaperScissorsPlayerAction,
  RockPaperScissorsHostAction
> = {
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


const RockPaperScissorsGameSchemas: BfgEngineMetadataSchemas<
  RockPaperScissorsHostGameState,
  RockPaperScissorsPlayerGameState,
  RockPaperScissorsWatcherGameState
> = {
  hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
  playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
  watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,

  // playerActionSchemas: AllRockPaperScissorsPlayerActionSchemas,
  // hostActionSchemas: AllRockPaperScissorsHostActionSchemas,
};


const RockPaperScissorsGameAccessLevelConverters: IBfgGameEngineAccessLevelConverters<
  RockPaperScissorsHostGameState,
  RockPaperScissorsPlayerGameState,
  RockPaperScissorsWatcherGameState
> = {

  hostToPlayerSeatGameStates: (_gameTable: GameTable, hostState: RockPaperScissorsHostGameState) => {
    const retVal = ALL_PLAYER_SEATS.map((seat: GameTableSeat) => {
      const playerGameState: RockPaperScissorsPlayerGameState = {
        // playerSeat: seat,
        myChoice: hostState[`p${seat}Choice`] as RockPaperScissorsPlayerChoice,
        p1WinCount: hostState.p1WinCount,
        p2WinCount: hostState.p2WinCount,
        tieCount: hostState.tieCount,
      };
      const playerSeatGameState: PlayerSeatGameState<RockPaperScissorsPlayerGameState> = {
        playerSeat: seat,
        playerGameState: playerGameState,
      };
      return playerSeatGameState;
    });

    return retVal;
  },

  hostToWatcherAccessLevel: (hostState: RockPaperScissorsHostGameState) => {
    const watcherGameState: RockPaperScissorsWatcherGameState = {
      ...hostState,
      p1Showing: hostState.p1Choice,
      p2Showing: hostState.p2Choice,
      p1WinCount: hostState.p1WinCount,
      p2WinCount: hostState.p2WinCount,
      tieCount: hostState.tieCount,
    };
    return watcherGameState;
  },
};



export const RockPaperScissorsGameMetadata: IBfgGameCompleteMetadata<
  RockPaperScissorsHostGameState,
  RockPaperScissorsPlayerGameState,
  RockPaperScissorsWatcherGameState,
  RockPaperScissorsPlayerAction,
  RockPaperScissorsHostAction
  // RockPaperScissorsPlayerActionsUnion,
> = {
  metadataType: 'private-player-knowledge-game',
  gameTitle: RockPaperScissorsGameName,
  definition: RockPaperScissorsGameDefinition,
  // gameStateAccessTypes: RockPaperScissorsGameStateAccessTypes,

  schemas: RockPaperScissorsGameSchemas,
  encoders: RockPaperScissorsGameEncoders,
  accessLevelConverters: RockPaperScissorsGameAccessLevelConverters,
  
  gameProcessor: RockPaperScissorsCompleteGameProcessor,
  components: RockPaperScissorsGameComponents,
};
