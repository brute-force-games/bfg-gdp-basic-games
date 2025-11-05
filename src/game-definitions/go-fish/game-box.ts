import { GameDefinition } from "@bfg-engine";
import { BfgGameEngineMetadata, PrivatePlayerKnowledgeBfgGameEngineMetadata, TBfgGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { 
  GoFishGameName, 
  GoFishGameProcessor
} from "./engine/go-fish-engine";
import { BfgGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { 
  GoFishHostGameStateEncoder, 
  GoFishPlayerActionEncoder, 
  GoFishHostActionEncoder, 
  GoFishPublicGameStateEncoder,
  GoFishPrivatePlayerKnowledgeEncoder
} from "./engine/encoders";
import { GoFishPlayerComponent } from "./ui/components/go-fish-player-component";
import { GoFishObserverComponent } from "./ui/components/go-fish-observer-component";
import { GoFishHostComponent } from "./ui/components/go-fish-host-component";
import { GoFishPlayerAction, GoFishHostAction, GoFishPlayerHandState, GoFishHostGameState, GoFishPublicGameState } from "./go-fish-types";


export const GoFishGameDefinition: GameDefinition = {
  title: GoFishGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 6
};

export const GoFishGameComponents: BfgGameEngineComponents<
  GoFishHostGameState,
  GoFishPlayerAction,
  GoFishHostAction,
  GoFishPlayerHandState
> = {
  ObserverComponent: GoFishObserverComponent,
  PlayerComponent: GoFishPlayerComponent,
  HostComponent: GoFishHostComponent,
};


export const GoFishGameMetadata: TBfgGameEngineMetadata<
  'private-player-knowledge',
  GoFishHostGameState,
  GoFishPublicGameState,
  GoFishPlayerAction,
  GoFishHostAction,
  GoFishPlayerHandState
> = {
  gameTitle: GoFishGameName,
  definition: GoFishGameDefinition,

  gameKnowledgeType: 'private-player-knowledge',
  encoders: {
    hostGameStateEncoder: GoFishHostGameStateEncoder,
    publicGameStateEncoder: GoFishPublicGameStateEncoder,
    privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
    playerActionEncoder: GoFishPlayerActionEncoder,
    hostActionEncoder: GoFishHostActionEncoder,
  },
  // hostGameStateEncoder: GoFishHostGameStateEncoder,
  // publicGameStateEncoder: GoFishPublicGameStateEncoder,
  // privatePlayerKnowledgeEncoder: GoFishPrivatePlayerKnowledgeEncoder,
  // playerActionEncoder: GoFishPlayerActionEncoder,
  // hostActionEncoder: GoFishHostActionEncoder,

  engine: GoFishGameProcessor,
  components: GoFishGameComponents,
};
