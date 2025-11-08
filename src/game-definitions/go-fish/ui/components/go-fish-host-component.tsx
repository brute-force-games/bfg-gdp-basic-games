import { GoFishGameProcessor } from '../../engine/go-fish-engine';
import { GameHostComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';
import { GoFishHostAction, GoFishHostGameState } from '../../go-fish-types';


export const GoFishHostComponent = (props: GameHostComponentProps<GoFishHostGameState, GoFishHostAction>) => {
  const { gameTable, gameState } = props;
  // const currentPlayerSeat = getCurrentPlayer(gameState);

  const processor = GoFishGameProcessor;

  const allPlayerStates = processor.getAllPlayersPrivateKnowledge(gameTable, gameState);
  if (!allPlayerStates) {
    return (
      <Box>
        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
          No player states found
        </Typography>
      </Box>
    );
  }

  
  return (
    <Box>
      <Stack spacing={3}>
        <Box style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
            Host View - You can see all game state
          </Typography>
        </Box>
        {/* <GoFishRepresentation 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          myHandState={myHandState}
        /> */}
        
        {/* Host admin info */}
        <Box style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Typography variant="subtitle2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
            Game Administration
          </Typography>
          <Stack spacing={1}>
            <Typography variant="caption">
              Deck: {gameState.deck.length} cards remaining
            </Typography>
            {Object.entries(allPlayerStates).map(([seat, playerHandState]) => {
              const playerBoardState = gameState.playerBoardStates[seat as keyof typeof gameState.playerBoardStates];
              return (
                <Typography key={seat} variant="caption">
                  {seat}: {playerHandState.hand.length} cards, {playerBoardState?.score ?? 0} sets, 
                  Completed: [{playerBoardState?.completedSets.join(', ') ?? ''}]
                </Typography>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
