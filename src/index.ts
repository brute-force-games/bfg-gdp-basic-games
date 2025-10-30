import { registerGame } from "@bfg-engine";
import { FlipACoinGameMetadata } from "./game-definitions/flip-a-coin/game-box";
import { TicTacToeGameMetadata } from "./game-definitions/tic-tac-toe/game-box";
import { HangmanGameMetadata } from "./game-definitions/hangman/game-box";


export const initBasicGames = () => {
  registerGame(TicTacToeGameMetadata);
  registerGame(FlipACoinGameMetadata);
  registerGame(HangmanGameMetadata);
}
