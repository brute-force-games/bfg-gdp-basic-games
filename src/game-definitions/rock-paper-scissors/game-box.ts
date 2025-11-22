import { RockPaperScissorsCompleteGameProcessor } from "./engine/rock-paper-scissors-engine";
import { RockPaperScissorsGameName } from "./engine/rock-paper-scissors-engine";
import type { GameDefinition } from "@bfg-engine/models/game-box-definition";
import {
  RockPaperScissorsGameEventOutcomeSchema,
  RockPaperScissorsGameEventSchema,
  RockPaperScissorsHostGameStateSchema,
  RockPaperScissorsPlayerGameStateSchema,
  RockPaperScissorsWatcherGameStateSchema,
  type RockPaperScissorsGameEvent,
  type RockPaperScissorsHostGameState,
  type RockPaperScissorsPlayerGameState,
  type RockPaperScissorsWatcherGameState,
} from "./rock-paper-scissors-types";
import { RpsGameSpineComponent, RpsHistoryComponent, RpsHostComponent, RpsObserverComponent, RpsPlayerComponent } from "./ui/components";
import { createBfgEngineMetadataSchemas, type BfgGameEngineMetadata } from "@bfg-engine/game-metadata/metadata-types";
import type { BfgGameEngineComponents } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { createBfgGameEngineAccessLevelAdapters } from "@bfg-engine/game-metadata/factories/game-access-level-adapter-factory";


export const RockPaperScissorsGameDefinition: GameDefinition = {
  title: RockPaperScissorsGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2
};


const RockPaperScissorsGameComponents: BfgGameEngineComponents = {
  ObserverComponent: RpsObserverComponent,
  PlayerComponent: RpsPlayerComponent,
  HostComponent: RpsHostComponent,
  HistoryComponent: RpsHistoryComponent,
  GameSpineComponent: RpsGameSpineComponent,
};


const RockPaperScissorsGameSchemas = createBfgEngineMetadataSchemas({
  hostGameStateSchema: RockPaperScissorsHostGameStateSchema,
  playerGameStateSchema: RockPaperScissorsPlayerGameStateSchema,
  watcherGameStateSchema: RockPaperScissorsWatcherGameStateSchema,

  gameEventSchema: RockPaperScissorsGameEventSchema,
  gameEventOutcomeSchema: RockPaperScissorsGameEventOutcomeSchema,
});


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
    myHostEventTransitionFromHostEventTransitionDb: (hostEventTransition: RockPaperScissorsGameEvent): RockPaperScissorsGameEvent => {
      return {
        ...hostEventTransition,
        // p1Choice: hostEventTransitionDb.p1Choice,
        // p2Choice: hostEventTransitionDb.p2Choice,
      };
    },
    // myHostEventTransitionToPlayerAccessLevelAdapter: (playerSeat: GameTableSeat, hostEventTransitionDb: GameBoardEventForDb): GameTableEventForPlayerP2p => {
    //   return {
    //     ...hostEventTransitionDb,
    //     p1Choice: hostEventTransitionDb.p1Choice,
    //     p2Choice: hostEventTransitionDb.p2Choice,
    //   };
    // },
    // myHostEventTransitionToWatcherAccessLevelAdapter: (hostEventTransition: GameBoardEventForDb): GameTableEventForWatcherP2p => {
    //   return {
    //     ...hostEventTransition,
    //     p1Choice: hostEventTransition.p1Choice,
    //     p2Choice: hostEventTransition.p2Choice,
    //   };
    // },
  },
});


export const RockPaperScissorsGameMetadata: BfgGameEngineMetadata = {
  metadataType: 'private-player-knowledge-game',
  gameTitle: RockPaperScissorsGameName,
  definition: RockPaperScissorsGameDefinition,

  schemas: RockPaperScissorsGameSchemas,
  accessLevelAdapters: RockPaperScissorsGameAccessLevelAdapters,
  
  gameProcessor: RockPaperScissorsCompleteGameProcessor,
  components: RockPaperScissorsGameComponents,
};
