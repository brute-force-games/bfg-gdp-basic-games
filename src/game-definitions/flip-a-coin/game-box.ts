import { GameDefinition } from "@bfg-engine";
import { FlipACoinPlayerAction, FlipACoinGameState, FlipACoinGameProcessor, FlipACoinHostAction, FlipACoinGameName, FlipACoinGameStateSchema, FlipACoinPlayerActionSchema, FlipACoinHostActionSchema } from "./engine/flip-a-coin-engine";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { FlipACoinObserverComponent } from "./ui/components/flip-a-coin-observer-component";
import { FlipACoinHostComponent } from "./ui/components/flip-a-coin-host-component";
import { FlipACoinPlayerComponent } from "./ui/components/flip-a-coin-player-component";
import { FlipACoinGameSpineComponent } from "./ui/components/flip-a-coin-game-spine-component";
import { createPublicKnowledgeGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
import { BfgGameEngineSchemas } from "@bfg-engine/models/game-engine/bfg-game-engine-schemas";


export const FlipACoinGameDefinition: GameDefinition = {
  title: FlipACoinGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};


export const FlipACoinGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  FlipACoinGameState,
  FlipACoinPlayerAction,
  FlipACoinHostAction
> = {
  ObserverComponent: FlipACoinObserverComponent,
  PlayerComponent: FlipACoinPlayerComponent,
  HostComponent: FlipACoinHostComponent,
  GameSpineComponent: FlipACoinGameSpineComponent,
};

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



const FlipACoinGameSchemas: BfgGameEngineSchemas = {
  hostGameStateSchema: FlipACoinGameStateSchema,
  publicGameStateSchema: FlipACoinGameStateSchema,
  playerActionSchema: FlipACoinPlayerActionSchema,
  hostActionSchema: FlipACoinHostActionSchema,
  privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
};


export const FlipACoinGameMetadata = createPublicKnowledgeGameMetadata(
  FlipACoinGameName,
  FlipACoinGameDefinition,
  FlipACoinGameSchemas,
  FlipACoinGameProcessor,
  FlipACoinGameComponents
);
