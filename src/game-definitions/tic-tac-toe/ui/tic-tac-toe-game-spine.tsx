import { TicTacToeGameName, TicTacToeGameState } from "../engine/tic-tac-toe-engine";
import { BfgGameSpine } from '@bfg-engine/ui/bfg-ui';
import { GameTable } from '@bfg-engine/models/game-table/game-table';
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { useGameMetadata } from "@bfg-engine";
import { GameSpineLocation } from "@bfg-engine/models/app-settings";


interface TicTacToeGameSpineProps {
  gameState: TicTacToeGameState;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  // orientation: 'horizontal' | 'vertical';
  location: GameSpineLocation;
}

export const TicTacToeGameSpine = (props: TicTacToeGameSpineProps) => {
  const { gameState, gameTable, allPlayerProfiles, location } = props;
  
  const gameMetadata = useGameMetadata(TicTacToeGameName);

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameTable, gameState);
  const playerDetailsLineFn = gameMetadata.engine.getPlayerDetailsLine;

  return (
    <BfgGameSpine
      gameTitle={TicTacToeGameName}
      gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/tic-tac-toe"
      orientation="horizontal"
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />
  );
};