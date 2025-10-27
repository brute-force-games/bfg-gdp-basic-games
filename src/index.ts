import { registerGame } from "@bfg-engine";
import { FlipACoinGameMetadata } from "./game-definitions/flip-a-coin/game-box";
import { TicTacToeGameMetadata } from "./game-definitions/tic-tac-toe/game-box";
import { HangmanGameMetadata } from "./game-definitions/hangman/game-box";

// // Create metadata objects with game definitions
// const TicTacToeGameMetadata = {
//   definition: TicTacToeGameDefinition,
//   processor: TicTacToeGameStateProcessor
// };

// const FlipACoinGameMetadata = {
//   definition: FlipACoinGameDefinition,
//   processor: FlipACoinGameStateProcessor
// };

// const HangmanGameMetadata = {
//   definition: HangmanGameDefinition,
//   processor: HangmanGameStateProcessor
// };



// const BingoGameMetadata: BfgGameEngineMetadata<BingoGameState, BingoPlayerAction, BingoHostAction> = {
//   gameTitle: BingoGameName,
//   definition: BingoGameDefinition,

//   gameSpecificStateEncoder: createJsonZodObjectDataEncoder(BingoGameStateSchema),
//   playerActionEncoder: createJsonZodObjectDataEncoder(BingoPlayerActionSchema),
//   hostActionEncoder: createJsonZodObjectDataEncoder(BingoHostActionSchema),

//   engine: BingoGameProcessor,
//   components: BingoGameComponents,
// };


export const initBasicGames = () => {
  registerGame(TicTacToeGameMetadata);
  registerGame(FlipACoinGameMetadata);
  registerGame(HangmanGameMetadata);
}
