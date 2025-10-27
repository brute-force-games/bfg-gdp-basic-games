import { TicTacToeGameState, TicTacToePlayerAction } from '../../engine/tic-tac-toe-engine';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { Box, Typography, Stack } from '@bfg-engine/ui/bfg-ui';

export const TicTacToePlayerComponent = (props: PlayerComponentProps<TicTacToeGameState, TicTacToePlayerAction>) => {
  const { gameState, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h5">Tic Tac Toe - Player View</Typography>
        <TicTacToeGrid 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          onGameAction={(_, gameAction) => {
            // Convert TicTacToeMove to TicTacToePlayerAction
            const playerAction: TicTacToePlayerAction = {
              source: 'player',
              playerActionType: 'game-table-action-player-move',
              moveCell: gameAction.moveCell,
              movePlayer: gameAction.movePlayer,
            };
            onPlayerAction(playerAction);
          }}
        />
      </Stack>
    </Box>
  );
};
