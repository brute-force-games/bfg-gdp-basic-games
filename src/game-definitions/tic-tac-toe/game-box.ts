import { GameDefinition } from "@bfg-engine";
import { 
  TicTacToeGameName, 
  TicTacToeGameState, 
  TicTacToePlayerAction,
  TicTacToeHostAction,
  TicTacToeGameProcessor,
  TicTacToeGameStateSchema,
  TicTacToeHostActionSchema,
  TicTacToePlayerActionSchema
} from "./engine/tic-tac-toe-engine";
// import type { IBfgGameEngineComponents } from "@bfg-engine/game-metadata/ui/bfg-game-components";
// import { BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
// import { BfgGameSpecificPlayerActionOutcomeSchema, BfgGameSpecificHostActionOutcomeSchema } from "@bfg-engine/game-metadata/metadata-types/game-action-types";
import { TicTacToePlayerComponent } from "./ui/components/tic-tac-toe-player-component";
import { TicTacToeObserverComponent } from "./ui/components/tic-tac-toe-observer-component";
import { TicTacToeHostComponent } from "./ui/components/tic-tac-toe-host-component";
// import { createPublicKnowledgeGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
import { BfgGameEngineSchemas } from "@bfg-engine/models/game-engine/bfg-game-engine-schemas";


export const TicTacToeGameDefinition: GameDefinition = {
  title: TicTacToeGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2
};

export const TicTacToeGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  TicTacToeGameState,
  TicTacToePlayerAction,
  TicTacToeHostAction
> = {
  ObserverComponent: TicTacToeObserverComponent,
  PlayerComponent: TicTacToePlayerComponent,
  HostComponent: TicTacToeHostComponent,
};

// export const TicTacToeGameMetadata: BfgAllPublicKnowledgeGameEngineMetadata<
//   TicTacToeGameState,
//   TicTacToePlayerAction,
//   TicTacToeHostAction
// > = {
//   gameTitle: TicTacToeGameName,
//   definition: TicTacToeGameDefinition,
//   gameKnowledgeType: 'public-knowledge',

//   encoders: {
//     hostGameStateEncoder: TicTacToeGameSpecificStateEncoder,
//     publicGameStateEncoder: TicTacToeGameSpecificStateEncoder,
//     playerActionEncoder: TicTacToePlayerActionEncoder,
//     hostActionEncoder: TicTacToeHostActionEncoder,
//   },

//   // gameSpecificStateEncoder: TicTacToeGameSpecificStateEncoder,
//   // playerActionEncoder: TicTacToePlayerActionEncoder,
//   // hostActionEncoder: TicTacToeHostActionEncoder,

//   engine: TicTacToeGameProcessor,
//   components: TicTacToeGameComponents,
// };


const TicTacToeGameSchemas: BfgGameEngineSchemas = {
  hostGameStateSchema: TicTacToeGameStateSchema,
  publicGameStateSchema: TicTacToeGameStateSchema,
  playerActionSchema: TicTacToePlayerActionSchema,
  hostActionSchema: TicTacToeHostActionSchema,
  playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
  hostActionOutcomeSchema: BfgGameSpecificHostActionOutcomeSchema,
  privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
};


export const TicTacToeGameMetadata = createPublicKnowledgeGameMetadata(
  TicTacToeGameName,
  TicTacToeGameDefinition,
  TicTacToeGameSchemas,
  TicTacToeGameProcessor,
  TicTacToeGameComponents
);
