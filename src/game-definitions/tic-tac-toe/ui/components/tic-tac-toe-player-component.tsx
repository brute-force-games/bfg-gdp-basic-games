import { TicTacToeGameState, TicTacToePlayerAction } from '../../engine/tic-tac-toe-engine';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';

export const TicTacToePlayerComponent = (props: PlayerComponentProps<TicTacToeGameState, TicTacToePlayerAction>) => {
  const { gameState, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <div>
      <h3>Tic Tac Toe - Player View</h3>
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
    </div>
  );
};
