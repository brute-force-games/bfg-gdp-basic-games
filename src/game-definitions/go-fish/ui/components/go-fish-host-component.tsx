import { GoFishGameState, GoFishHostAction, getCurrentPlayer } from '../../engine/go-fish-engine';
import { GameHostComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';

export const GoFishHostComponent = (props: GameHostComponentProps<GoFishGameState, GoFishHostAction>) => {
  const { gameState } = props;
  const currentPlayerSeat = getCurrentPlayer(gameState);
  
  return (
    <Box>
      <Stack spacing={3}>
        <Box sx={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
          <Typography variant="body2" fontWeight="bold">
            Host View - You can see all game state
          </Typography>
        </Box>
        <GoFishRepresentation 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
        />
        
        {/* Host admin info */}
        <Box sx={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ marginBottom: '12px' }}>
            Game Administration
          </Typography>
          <Stack spacing={1}>
            <Typography variant="caption">
              Deck: {gameState.deck.length} cards remaining
            </Typography>
            {Object.entries(gameState.playerStates).map(([seat, playerState]) => (
              <Typography key={seat} variant="caption">
                {seat}: {playerState.hand.length} cards, {playerState.score} sets, 
                Completed: [{playerState.completedSets.join(', ')}]
              </Typography>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

