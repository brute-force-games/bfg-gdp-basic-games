import { GameDefinition } from "@bfg-engine";
import { BfgAllPublicKnowledgeGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { 
  TicTacToeGameName, 
  TicTacToeGameState, 
  TicTacToePlayerAction,
  TicTacToeHostAction,
  TicTacToeGameProcessor
} from "./engine/tic-tac-toe-engine";
import { BfgAllPublicKnowledgeGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { TicTacToeGameSpecificStateEncoder, TicTacToePlayerActionEncoder, TicTacToeHostActionEncoder } from "./engine/encoders";
import { TicTacToePlayerComponent } from "./ui/components/tic-tac-toe-player-component";
import { TicTacToeObserverComponent } from "./ui/components/tic-tac-toe-observer-component";
import { TicTacToeHostComponent } from "./ui/components/tic-tac-toe-host-component";


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

export const TicTacToeGameMetadata: BfgAllPublicKnowledgeGameEngineMetadata<
  TicTacToeGameState,
  TicTacToePlayerAction,
  TicTacToeHostAction
> = {
  gameTitle: TicTacToeGameName,
  definition: TicTacToeGameDefinition,
  gameKnowledgeType: 'public-knowledge',

  encoders: {
    hostGameStateEncoder: TicTacToeGameSpecificStateEncoder,
    publicGameStateEncoder: TicTacToeGameSpecificStateEncoder,
    playerActionEncoder: TicTacToePlayerActionEncoder,
    hostActionEncoder: TicTacToeHostActionEncoder,
  },

  // gameSpecificStateEncoder: TicTacToeGameSpecificStateEncoder,
  // playerActionEncoder: TicTacToePlayerActionEncoder,
  // hostActionEncoder: TicTacToeHostActionEncoder,

  engine: TicTacToeGameProcessor,
  components: TicTacToeGameComponents,
};
