import { registerGame } from "@bfg-engine";
import { TicTacToeGameName, TicTacToeGameDefinition } from "./game-definitions/tic-tac-toe/game-box";
import { TicTacToeGameStateProcessor } from "./game-definitions/tic-tac-toe/engine/tic-tac-toe-engine";
import { FlipACoinGameName, FlipACoinGameDefinition } from "./game-definitions/flip-a-coin/game-box";
import { FlipACoinGameStateProcessor } from "./game-definitions/flip-a-coin/engine/flip-a-coin-engine";
import { HangmanGameName, HangmanGameDefinition } from "./game-definitions/hangman/game-box";
import { HangmanGameStateProcessor } from "./game-definitions/hangman/engine/hangman-engine";

// Create metadata objects with game definitions
const TicTacToeGameMetadata = {
  processor: TicTacToeGameStateProcessor
};

const FlipACoinGameMetadata = {
  processor: FlipACoinGameStateProcessor
};

const HangmanGameMetadata = {
  processor: HangmanGameStateProcessor
};

export const initBasicGames = () => {
  registerGame(TicTacToeGameName, TicTacToeGameDefinition, TicTacToeGameMetadata);
  registerGame(FlipACoinGameName, FlipACoinGameDefinition, FlipACoinGameMetadata);
  registerGame(HangmanGameName, HangmanGameDefinition, HangmanGameMetadata);
}
