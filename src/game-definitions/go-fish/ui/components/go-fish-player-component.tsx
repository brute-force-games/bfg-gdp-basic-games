import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { GoFishInput } from '../go-fish-input';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';
import { GoFishPublicGameState, GoFishPlayerHandState, GoFishPlayerAction } from '../../go-fish-types';


export const GoFishPlayerComponent = (props: PlayerComponentProps<GoFishPublicGameState, GoFishPlayerAction, GoFishPlayerHandState>) => {
  const { gameState, myPrivatePlayerKnowledge, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <GoFishRepresentation 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          myHandState={myPrivatePlayerKnowledge}
        />
        <GoFishInput 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          myPlayerState={myPrivatePlayerKnowledge}
          onGameAction={(_, action) => {
            onPlayerAction(action);
          }}
        />
      </Stack>
    </Box>
  );
};

