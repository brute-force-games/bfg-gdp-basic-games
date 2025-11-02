import { GoFishGameState } from '../../engine/go-fish-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';

export const GoFishObserverComponent = (props: ObserverComponentProps<GoFishGameState>) => {
  const { gameState, observedPlayerSeat } = props;
  
  const viewingSeat = observedPlayerSeat || 'p1';
  
  return (
    <Box>
      <Stack spacing={3}>
        <Box sx={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <Typography variant="body2" color="secondary">
            Observer Mode - Viewing from {viewingSeat}'s perspective
          </Typography>
        </Box>
        <GoFishRepresentation 
          myPlayerSeat={viewingSeat}
          gameState={gameState}
        />
      </Stack>
    </Box>
  );
};

