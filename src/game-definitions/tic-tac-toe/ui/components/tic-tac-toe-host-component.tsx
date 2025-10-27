import { TicTacToeGameState, TicTacToeHostAction, getCurrentPlayer } from '../../engine/tic-tac-toe-engine';
import { GameHostComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';

export const TicTacToeHostComponent = (props: GameHostComponentProps<TicTacToeGameState, TicTacToeHostAction>) => {
  const { gameState, onHostAction } = props;
  const currentPlayerSeat = getCurrentPlayer(gameState);
  
  return (
    <div>
      <h3>Tic Tac Toe - Host View</h3>
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
    </div>
  );
};
