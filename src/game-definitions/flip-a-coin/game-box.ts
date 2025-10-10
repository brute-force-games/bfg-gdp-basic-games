import { BfgSupportedGameTitle, GameDefinition } from "@bfg-engine";


export const FlipACoinGameName = 'Flip a Coin' as BfgSupportedGameTitle;

export const FlipACoinGameDefinition: GameDefinition = {
  title: FlipACoinGameName,
  minNumPlayersForGame: 1,
  maxNumPlayersForGame: 6
};
