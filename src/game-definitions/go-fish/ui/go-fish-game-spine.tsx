import { BfgGameSpine } from '@bfg-engine/ui/bfg-ui';
import { GameTable } from '@bfg-engine/models/game-table/game-table';
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { useGameMetadata } from "@bfg-engine";
import { GoFishGameName } from "../engine/go-fish-engine";
import { GoFishPublicGameState } from "../go-fish-types";


interface GoFishGameSpineProps {
  gameTable: GameTable;
  orientation: 'horizontal' | 'vertical';
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;

  gameState: GoFishPublicGameState;
}

export const GoFishGameSpine = (props: GoFishGameSpineProps) => {
  const { gameState, gameTable, allPlayerProfiles, orientation } = props;
  
  const gameMetadata = useGameMetadata(GoFishGameName);

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameTable, gameState);
  const playerDetailsLineFn = gameMetadata.engine.getPlayerDetailsLine;


  return (
    <BfgGameSpine
      gameTitle={GoFishGameName}
      gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/go-fish"
      orientation={orientation}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />
  );
};