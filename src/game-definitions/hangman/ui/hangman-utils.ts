// import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
// import { HangmanGameState } from "../engine/hangman-engine";


// export const isHangmanGuessingActive = (gameState: HangmanGameState) => {
//   return gameState.hiddenWordSource !== null && gameState.hiddenWordInfo !== null && !gameState.isGameOver;
// }

// export const getHiddenWordStatusLabel = (gameState: HangmanGameState, myPlayerSeat: GameTableSeat | null) => {
//   // Check if game is over first
//   if (gameState.isGameOver) {
//     return gameState.outcomeSummary || "Game Over";
//   }

//   if (!myPlayerSeat) {
//     return "You are not a player in this game.";
//   }

//   const myPlayerHiddenWordSubmission = gameState.playerHiddenWordSubmissions
//     .find(submission => submission.seat === myPlayerSeat);
  
//   if (myPlayerHiddenWordSubmission) {
//     return `Waiting for host to pick a hidden word (maybe yours)...`;
//   }

//   return "You have not set a hidden word candidate yet.";  
// }
