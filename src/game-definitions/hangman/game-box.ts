import { GameDefinition } from "@bfg-engine";
import { BfgAllPublicKnowledgeGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { 
  HangmanGameName, 
  HangmanGameState, 
  HangmanPlayerAction,
  HangmanHostAction,
  HangmanGameProcessor
} from "./engine/hangman-engine";
import { BfgAllPublicKnowledgeGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { HangmanPublicGameStateEncoder, HangmanPlayerActionEncoder, HangmanHostActionEncoder } from "./engine/encoders";
import { HangmanPlayerComponent } from "./ui/components/hangman-player-component";
import { HangmanObserverComponent } from "./ui/components/hangman-observer-component";
import { HangmanHostComponent } from "./ui/components/hangman-host-component";


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

export const HangmanGameMetadata: BfgAllPublicKnowledgeGameEngineMetadata<
  HangmanGameState, 
  HangmanPlayerAction, 
  HangmanHostAction
> = {

  gameTitle: HangmanGameName,
  definition: HangmanGameDefinition,
  gameKnowledgeType: 'public-knowledge',

  // hostGameStateEncoder: HangmanHostGameStateEncoder,
  // publicGameStateEncoder: HangmanPublicGameStateEncoder,
  // playerActionEncoder: HangmanPlayerActionEncoder,
  // hostActionEncoder: HangmanHostActionEncoder,

  encoders: {
    hostGameStateEncoder: HangmanPublicGameStateEncoder,
    publicGameStateEncoder: HangmanPublicGameStateEncoder,
    playerActionEncoder: HangmanPlayerActionEncoder,
    hostActionEncoder: HangmanHostActionEncoder,
  },

  engine: HangmanGameProcessor,
  components: HangmanGameComponents,
};
