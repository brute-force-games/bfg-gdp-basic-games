import { TicTacToeGameState, TicTacToePlayerAction } from '../../engine/tic-tac-toe-engine';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';
import { TicTacToeGameSpine } from '../tic-tac-toe-game-spine';


export const TicTacToePlayerComponent = (props: PlayerComponentProps<TicTacToeGameState, TicTacToePlayerAction>) => {
  const { gameState, gameTable, allPlayerProfiles, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <Box>
      <Stack spacing={3}>
        <TicTacToeGameSpine 
          gameTable={gameTable}
          gameState={gameState}
          orientation="horizontal"
          allPlayerProfiles={allPlayerProfiles}
        />
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
