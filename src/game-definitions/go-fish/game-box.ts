import { GameDefinition } from "@bfg-engine";
import { BfgGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { 
  GoFishGameName, 
  GoFishGameState, 
  GoFishPlayerAction,
  GoFishHostAction,
  GoFishGameProcessor
} from "./engine/go-fish-engine";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgPrivatePlayerKnowledgeImpl } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { 
  GoFishGameSpecificStateEncoder, 
  GoFishPlayerActionEncoder, 
  GoFishHostActionEncoder 
} from "./engine/encoders";
import { GoFishPlayerComponent } from "./ui/components/go-fish-player-component";
import { GoFishObserverComponent } from "./ui/components/go-fish-observer-component";
import { GoFishHostComponent } from "./ui/components/go-fish-host-component";

export const GoFishGameDefinition: GameDefinition = {
  title: GoFishGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 6
};

export const GoFishGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  GoFishGameState,
  GoFishPlayerAction,
  GoFishHostAction
> = {
  ObserverComponent: GoFishObserverComponent,
  PlayerComponent: GoFishPlayerComponent,
  HostComponent: GoFishHostComponent,
};

export const GoFishGameMetadata: BfgGameEngineMetadata<
  GoFishGameState,
  GoFishPlayerAction,
  GoFishHostAction,
  BfgPrivatePlayerKnowledgeImpl
> = {
  gameTitle: GoFishGameName,
  definition: GoFishGameDefinition,

  gameSpecificStateEncoder: GoFishGameSpecificStateEncoder,
  playerActionEncoder: GoFishPlayerActionEncoder,
  hostActionEncoder: GoFishHostActionEncoder,

  engine: GoFishGameProcessor,
  components: GoFishGameComponents,
};

