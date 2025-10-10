import { BfgSupportedGameTitle, GameDefinition } from "@bfg-engine";


export const TicTacToeGameName = 'Tic Tac Toe' as BfgSupportedGameTitle;


export const TicTacToeGameDefinition: GameDefinition = {
  title: TicTacToeGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 2
};
