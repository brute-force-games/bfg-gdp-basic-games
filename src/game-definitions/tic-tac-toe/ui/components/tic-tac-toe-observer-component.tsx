import { TicTacToeGameState } from '../../engine/tic-tac-toe-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { Box, Typography, Stack } from '@bfg-engine/ui/bfg-ui';

export const TicTacToeObserverComponent = (props: ObserverComponentProps<TicTacToeGameState>) => {
  const { gameState, observedPlayerSeat } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h5">Tic Tac Toe - Observer View</Typography>
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
