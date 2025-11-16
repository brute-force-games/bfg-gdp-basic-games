import { GameDefinition } from "@bfg-engine";
import { GoFishGameName, GoFishGameProcessor, } from "./engine/go-fish-engine";
import { BfgGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { GoFishPlayerComponent } from "./ui/components/go-fish-player-component";
import { GoFishObserverComponent } from "./ui/components/go-fish-observer-component";
import { GoFishHostComponent } from "./ui/components/go-fish-host-component";
import { GoFishPlayerAction, GoFishHostAction, GoFishPlayerHandState, GoFishHostGameState, GoFishHostActionSchema, GoFishHostGameStateSchema, GoFishPlayerActionSchema, GoFishPlayerHandStateSchema, GoFishPublicGameStateSchema, GoFishPublicGameState } from "./go-fish-types";
import { createGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
import { BfgGameEngineSchemas } from "@bfg-engine/models/game-engine/bfg-game-engine-schemas";
import { BfgGameSpecificPlayerActionOutcomeSchema, BfgGameSpecificHostActionOutcomeSchema } from "@bfg-engine/models/game-table/game-table-action";
import { GoFishGameSpine } from "./ui/go-fish-game-spine";


export const GoFishGameDefinition: GameDefinition = {
  title: GoFishGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 6
};

export const GoFishGameComponents: BfgGameEngineComponents<
  GoFishHostGameState,
  GoFishPublicGameState,
  GoFishPlayerAction,
  GoFishHostAction,
  GoFishPlayerHandState
> = {
  ObserverComponent: GoFishObserverComponent,
  PlayerComponent: GoFishPlayerComponent,
  HostComponent: GoFishHostComponent,
  GameSpineComponent: GoFishGameSpine,
};


// export const GoFishGameMetadata: TBfgGameEngineMetadata<
//   'private-player-knowledge',
//   GoFishHostGameState,
//   GoFishPublicGameState,
//   GoFishPlayerAction,
//   GoFishHostAction,
//   GoFishPlayerHandState
// > = {
//   gameTitle: GoFishGameName,
//   definition: GoFishGameDefinition,

//   gameKnowledgeType: 'private-player-knowledge',
//   encoders: {
//     hostGameStateEncoder: GoFishHostGameStateEncoder,
//     publicGameStateEncoder: GoFishPublicGameStateEncoder,
//     privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
//     playerActionEncoder: GoFishPlayerActionEncoder,
//     hostActionEncoder: GoFishHostActionEncoder,
//   },
//   // hostGameStateEncoder: GoFishHostGameStateEncoder,
//   // publicGameStateEncoder: GoFishPublicGameStateEncoder,
//   // privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
//   // playerActionEncoder: GoFishPlayerActionEncoder,
//   // hostActionEncoder: GoFishHostActionEncoder,

//   engine: GoFishGameProcessor,
//   components: GoFishGameComponents,
// };



const GoFishGameSchemas: BfgGameEngineSchemas = {
  hostGameStateSchema: GoFishHostGameStateSchema,
  publicGameStateSchema: GoFishPublicGameStateSchema,
  playerActionSchema: GoFishPlayerActionSchema,
  hostActionSchema: GoFishHostActionSchema,
  playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
  hostActionOutcomeSchema: BfgGameSpecificHostActionOutcomeSchema,
  privatePlayerKnowledgeSchema: GoFishPlayerHandStateSchema,
};


export const GoFishGameMetadata = createGameMetadata(
  GoFishGameName,
  GoFishGameDefinition,
  GoFishGameSchemas,
  GoFishGameProcessor,
  GoFishGameComponents
);


// const GoFishGameMetadata: TBfgGameEngineMetadata<'private-player-knowledge', GoFishHostGameState, GoFishPublicGameState, GoFishPlayerAction, GoFishHostAction, GoFishPlayerHandState> = {
//   gameTitle: GoFishGameName,
//   definition: GoFishGameDefinition,
//   gameKnowledgeType: 'private-player-knowledge',
//   zodSchemas: GoFishGameSchemas,
//   encoders: {
//     hostGameStateEncoder: GoFishHostGameStateEncoder,
//     publicGameStateEncoder: GoFishPublicGameStateEncoder,
//     privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
//     playerActionEncoder: GoFishPlayerActionEncoder,
//     hostActionEncoder: GoFishHostActionEncoder,
//   },
//   // hostGameStateEncoder: GoFishHostGameStateEncoder,
//   // publicGameStateEncoder: GoFishPublicGameStateEncoder,
//   // privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
//   // playerActionEncoder: GoFishPlayerActionEncoder,
//   // hostActionEncoder: GoFishHostActionEncoder,

//   engine: GoFishGameProcessor,
//   components: GoFishGameComponents,
// };
