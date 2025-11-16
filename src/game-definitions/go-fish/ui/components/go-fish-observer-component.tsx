import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';
import { GoFishPublicGameState } from '../../go-fish-types';

export const GoFishObserverComponent = (props: ObserverComponentProps<GoFishPublicGameState>) => {
  const { gameState, observedPlayerSeat } = props;

  const viewingSeat = observedPlayerSeat || 'p1';

  console.log('GoFishObserverComponent gameState:', gameState);

  if (!gameState) {
    return (
      <Box style={{ padding: '16px' }}>
        <Typography>Loading game state...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Box style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <Typography variant="body2" color="secondary">
            Observer Mode - Viewing from {viewingSeat}'s perspective
          </Typography>
        </Box>
        <GoFishRepresentation 
          myPlayerSeat={viewingSeat}
          gameState={gameState}
          myHandState={null}
        />
      </Stack>
    </Box>
  );
};

