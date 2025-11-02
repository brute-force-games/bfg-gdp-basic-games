import { TicTacToeGameState, TicTacToeHostAction, getCurrentPlayer } from '../../engine/tic-tac-toe-engine';
import { GameHostComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';
import { TicTacToeGameSpine } from '../tic-tac-toe-game-spine';
import { Box, Stack } from '@bfg-engine/ui/bfg-ui';


export const TicTacToeHostComponent = (props: GameHostComponentProps<TicTacToeGameState, TicTacToeHostAction>) => {
  const { gameState, gameTable, allPlayerProfiles, onHostAction } = props;
  const currentPlayerSeat = getCurrentPlayer(gameState);
  
  // Create player profiles map from gameTable
  const playerProfiles = new Map();
  if (gameTable.p1) playerProfiles.set(gameTable.p1, { handle: `Player ${gameTable.p1.slice(-4)}` });
  if (gameTable.p2) playerProfiles.set(gameTable.p2, { handle: `Player ${gameTable.p2.slice(-4)}` });
  
  return (
    <Box>
      <Stack spacing={3}>
        <TicTacToeGameSpine
          gameTable={gameTable}
          gameState={gameState}
          location='top'
          allPlayerProfiles={allPlayerProfiles}
        />
        <TicTacToeGrid 
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          onGameAction={(gameState, _gameAction) => {
            // Convert the game action to host action format
            const hostAction: TicTacToeHostAction = {
              source: 'host',
              hostActionType: 'game-table-action-host-starts-game',
              board: gameState.board,
            };
            onHostAction(hostAction);
          }}
        />
      </Stack>
    </Box>
  );
};
