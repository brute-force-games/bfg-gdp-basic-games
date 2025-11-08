import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';
import { GoFishPublicGameState } from '../../go-fish-types';

export const GoFishObserverComponent = (props: ObserverComponentProps<GoFishPublicGameState>) => {
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

