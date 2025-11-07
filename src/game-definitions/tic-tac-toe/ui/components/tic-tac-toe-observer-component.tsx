import { TicTacToeGameState } from '../../engine/tic-tac-toe-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';

export const TicTacToeObserverComponent = (props: ObserverComponentProps<TicTacToeGameState>) => {
  const { gameState, observedPlayerSeat } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
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
