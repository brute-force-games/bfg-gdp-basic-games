import { GameDefinition } from "@bfg-engine";
import { FlipACoinGameState, FlipACoinGameProcessor, FlipACoinGameName, FlipACoinGameStateSchema, FlipACoinGameEventSchema, FlipACoinGameEventOutcomeSchema, type FlipACoinGameEvent } from "./engine/flip-a-coin-engine";
import { FlipACoinObserverComponent } from "./ui/components/flip-a-coin-observer-component";
import { FlipACoinHostComponent } from "./ui/components/flip-a-coin-host-component";
import { FlipACoinPlayerComponent } from "./ui/components/flip-a-coin-player-component";
import { FlipACoinGameSpineComponent } from "./ui/components/flip-a-coin-game-spine-component";
import { createBfgEngineMetadataSchemas, type BfgGameEngineMetadata } from "../../../../bfg-engine/src/game-metadata/metadata-types";
import type { BfgGameEngineComponents } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { createBfgGameEngineAccessLevelAdapters } from "@bfg-engine/game-metadata/factories/game-access-level-adapter-factory";



// export const FlipACoinGameMetadata: BfgAllPublicKnowledgeGameEngineMetadata<FlipACoinGameState, FlipACoinPlayerAction, FlipACoinHostAction> = {
//   gameTitle: FlipACoinGameName,
//   definition: FlipACoinGameDefinition,
//   gameKnowledgeType: 'public-knowledge',

//   // hostGameStateEncoder: FlipACoinGameSpecificStateEncoder, // Never used for public knowledge games
//   // // publicGameStateEncoder: FlipACoinGameSpecificStateEncoder,
//   // playerActionEncoder: FlipACoinPlayerActionEncoder,
//   // hostActionEncoder: FlipACoinHostActionEncoder,
//   // privatePlayerKnowledgeEncoder: null,

//   encoders: {
//     publicGameStateEncoder: FlipACoinGameSpecificStateEncoder,
//     hostGameStateEncoder: FlipACoinGameSpecificStateEncoder,
//     playerActionEncoder: FlipACoinPlayerActionEncoder,
//     hostActionEncoder: FlipACoinHostActionEncoder,
//   },

//   engine: FlipACoinGameProcessor,
//   components: FlipACoinGameComponents,
// };



// const FlipACoinGameSchemas: BfgGameEngineSchemas = {
//   hostGameStateSchema: FlipACoinGameStateSchema,
//   publicGameStateSchema: FlipACoinGameStateSchema,
//   playerActionSchema: FlipACoinPlayerActionSchema,
//   hostActionSchema: FlipACoinHostActionSchema,
//   playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
//   hostActionOutcomeSchema: BfgGameSpecificHostActionOutcomeSchema,
//   privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
// };

// const FlipACoinGameSchemas: BfgGameEngineSchemas = createGameTypes(
//   FlipACoinGameState,
//   FlipACoinGameState,
//   FlipACoinPlayerAction,
//   BfgGameSpecificPlayerActionOutcome,
//   FlipACoinHostAction,
//   BfgGameSpecificHostActionOutcome,
//   BfgPrivatePlayerKnowledgeImplState
// ) => {
//   return {
//     hostGameStateSchema: FlipACoinGameStateSchema,
//     publicGameStateSchema: FlipACoinGameStateSchema,
//     playerActionSchema: FlipACoinPlayerActionSchema,
//     hostActionSchema: FlipACoinHostActionSchema,
//     playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
//     hostActionOutcomeSchema: BfgGameSpecificHostActionOutcomeSchema,
//     privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
//   };
// };


// export const FlipACoinGameMetadata = createPublicKnowledgeGameMetadata(
//   FlipACoinGameName,
//   FlipACoinGameDefinition,
//   FlipACoinGameSchemas,
//   FlipACoinGameProcessor,
//   FlipACoinGameComponents
// );



export const FlipACoinGameDefinition: GameDefinition = {
  title: FlipACoinGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};


export const FlipACoinGameComponents: BfgGameEngineComponents = {
  ObserverComponent: FlipACoinObserverComponent,
  PlayerComponent: FlipACoinPlayerComponent,
  HostComponent: FlipACoinHostComponent,
  GameSpineComponent: FlipACoinGameSpineComponent,
};


const FlipACoinGameSchemas = createBfgEngineMetadataSchemas({
  hostGameStateSchema: FlipACoinGameStateSchema,
  playerGameStateSchema: FlipACoinGameStateSchema,
  watcherGameStateSchema: FlipACoinGameStateSchema,

  gameEventSchema: FlipACoinGameEventSchema,
  gameEventOutcomeSchema: FlipACoinGameEventOutcomeSchema,
});


const FlipACoinGameAccessLevelAdapters = createBfgGameEngineAccessLevelAdapters({
  schemas: FlipACoinGameSchemas,
  adapters: {
    myHostGameStateToPlayerAccessLevelAdapter: (hostState: FlipACoinGameState): FlipACoinGameState => {
      return hostState;
    },
    myHostGameStateToWatcherAccessLevelAdapter: (hostState: FlipACoinGameState): FlipACoinGameState => {
      return hostState;
    },
    myHostEventTransitionFromHostEventTransitionDb: (hostEventTransition: FlipACoinGameEvent): FlipACoinGameEvent => {
      return hostEventTransition;
    },
  },
});


export const FlipACoinGameMetadata: BfgGameEngineMetadata = {
  metadataType: 'public-knowledge-game',
  gameTitle: FlipACoinGameName,
  definition: FlipACoinGameDefinition,

  schemas: FlipACoinGameSchemas,
  components: FlipACoinGameComponents,
  
  gameProcessor: FlipACoinGameProcessor,
  accessLevelAdapters: FlipACoinGameAccessLevelAdapters,
};
