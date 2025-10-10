import { BfgSupportedGameTitle, GameDefinition } from "@bfg-engine";


export const HangmanGameName = 'Hangman' as BfgSupportedGameTitle;

export const HangmanGameDefinition: GameDefinition = {
  title: HangmanGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};
