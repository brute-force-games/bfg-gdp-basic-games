import { TicTacToeGameName, TicTacToeGameState } from "../engine/tic-tac-toe-engine";
import { BfgGameSpine } from '@bfg-engine/ui/bfg-ui';
import { GameTable } from '@bfg-engine/models/game-table/game-table';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';
import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { useGameMetadata } from "@bfg-engine";


interface TicTacToeGameSpineProps {
  gameState: TicTacToeGameState;
  gameTable: GameTable;
  allPlayerProfiles: Map<PlayerProfileId, PublicPlayerProfile>;
  orientation: 'horizontal' | 'vertical';
  // onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void;
}

export const TicTacToeGameSpine = (props: TicTacToeGameSpineProps) => {
  const { gameState, gameTable, allPlayerProfiles, orientation } = props;

  // const registry = useGameRegistry();
  // const gameMetadata = registry.getGameMetadata(TicTacToeGameName);
  const gameMetadata = useGameMetadata(TicTacToeGameName);
  // const gameState = gameTable.createdAt;

  // const nextGameStateJsonStr = gameMetadata.gameSpecificStateEncoder.encode(afterActionResult.gameSpecificState);

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameState);

  return (
    // <Box>
    //   <Stack spacing={3}>
        <BfgGameSpine
          gameTitle={TicTacToeGameName}
          gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/tic-tac-toe"
          orientation="horizontal"
          gameTable={gameTable}
          allPlayerProfiles={allPlayerProfiles}
          nextToActPlayers={nextToActPlayers}
        />

    //   </Stack>
    // </Box>
  );
};