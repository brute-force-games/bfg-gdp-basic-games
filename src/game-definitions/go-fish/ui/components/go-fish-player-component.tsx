import { GoFishGameState, GoFishPlayerAction } from '../../engine/go-fish-engine';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { GoFishInput } from '../go-fish-input';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';

export const GoFishPlayerComponent = (props: PlayerComponentProps<GoFishGameState, GoFishPlayerAction>) => {
  const { gameState, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <GoFishRepresentation 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
        />
        <GoFishInput 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          onGameAction={(_, action) => {
            onPlayerAction(action);
          }}
        />
      </Stack>
    </Box>
  );
};

