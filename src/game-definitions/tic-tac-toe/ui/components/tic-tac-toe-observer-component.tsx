import { TicTacToeGameState } from '../../engine/tic-tac-toe-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { TicTacToeGameSpine } from '../tic-tac-toe-game-spine';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';

export const TicTacToeObserverComponent = (props: ObserverComponentProps<TicTacToeGameState>) => {
  const { gameState, gameTable, allPlayerProfiles, observedPlayerSeat } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <TicTacToeGameSpine
          gameTable={gameTable}
          gameState={gameState}
          location="top"
          allPlayerProfiles={allPlayerProfiles}
        />
        <TicTacToeGrid 
          myPlayerSeat={observedPlayerSeat || 'p1'}
          gameState={gameState}
          onGameAction={() => {
            // Observer view is read-only, no actions allowed
          }}
        />
      </Stack>
    </Box>
  );
};
