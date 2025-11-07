import { GameDefinition } from "@bfg-engine";
import { 
  HangmanGameName, 
  HangmanGameState, 
  HangmanPlayerAction,
  HangmanHostAction,
  HangmanGameProcessor,
  HangmanHostActionSchema,
  HangmanGameStateSchema,
  HangmanPlayerActionSchema
} from "./engine/hangman-engine";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { HangmanPlayerComponent } from "./ui/components/hangman-player-component";
import { HangmanObserverComponent } from "./ui/components/hangman-observer-component";
import { HangmanHostComponent } from "./ui/components/hangman-host-component";
import { createPublicKnowledgeGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
import { BfgGameEngineSchemas } from "@bfg-engine/models/game-engine/bfg-game-engine-schemas";


export const HangmanGameDefinition: GameDefinition = {
  title: HangmanGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};


export const HangmanGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  HangmanGameState,
  HangmanPlayerAction,
  HangmanHostAction
> = {
  ObserverComponent: HangmanObserverComponent,
  PlayerComponent: HangmanPlayerComponent,
  HostComponent: HangmanHostComponent,
};

// export const HangmanGameMetadata: BfgAllPublicKnowledgeGameEngineMetadata<
//   HangmanGameState, 
//   HangmanPlayerAction, 
//   HangmanHostAction
// > = {

//   gameTitle: HangmanGameName,
//   definition: HangmanGameDefinition,
//   gameKnowledgeType: 'public-knowledge',

//   // hostGameStateEncoder: HangmanHostGameStateEncoder,
//   // publicGameStateEncoder: HangmanPublicGameStateEncoder,
//   // playerActionEncoder: HangmanPlayerActionEncoder,
//   // hostActionEncoder: HangmanHostActionEncoder,

//   encoders: {
//     hostGameStateEncoder: HangmanPublicGameStateEncoder,
//     publicGameStateEncoder: HangmanPublicGameStateEncoder,
//     playerActionEncoder: HangmanPlayerActionEncoder,
//     hostActionEncoder: HangmanHostActionEncoder,
//   },

//   engine: HangmanGameProcessor,
//   components: HangmanGameComponents,
// };


const HangmanGameSchemas: BfgGameEngineSchemas = {
  hostGameStateSchema: HangmanGameStateSchema,
  publicGameStateSchema: HangmanGameStateSchema,
  playerActionSchema: HangmanPlayerActionSchema,
  hostActionSchema: HangmanHostActionSchema,
  privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
};


export const HangmanGameMetadata = createPublicKnowledgeGameMetadata(
  HangmanGameName,
  HangmanGameDefinition,
  HangmanGameSchemas,
  HangmanGameProcessor,
  HangmanGameComponents
);
