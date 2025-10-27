import { GameDefinition } from "@bfg-engine";
import { BfgGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { FlipACoinPlayerAction, FlipACoinGameState, FlipACoinGameProcessor, FlipACoinHostAction, FlipACoinGameName } from "./engine/flip-a-coin-engine";
import { BfgAllPublicKnowledgeGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { FlipACoinGameSpecificStateEncoder, FlipACoinHostActionEncoder, FlipACoinPlayerActionEncoder } from "./engine/encoders";
import { FlipACoinObserverComponent } from "./ui/components/flip-a-coin-observer-component";
import { FlipACoinHostComponent } from "./ui/components/flip-a-coin-host-component";
import { FlipACoinPlayerComponent } from "./ui/components/flip-a-coin-player-component";


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
};

export const FlipACoinGameMetadata: BfgGameEngineMetadata<FlipACoinGameState, FlipACoinPlayerAction, FlipACoinHostAction> = {
  gameTitle: FlipACoinGameName,
  definition: FlipACoinGameDefinition,

  gameSpecificStateEncoder: FlipACoinGameSpecificStateEncoder,
  playerActionEncoder: FlipACoinPlayerActionEncoder,
  hostActionEncoder: FlipACoinHostActionEncoder,

  engine: FlipACoinGameProcessor,
  components: FlipACoinGameComponents,
};
