import { TicTacToeGameState } from '../../engine/tic-tac-toe-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { TicTacToeGrid } from '../tic-tac-toe-grid';

export const TicTacToeObserverComponent = (props: ObserverComponentProps<TicTacToeGameState>) => {
  const { gameState, observedPlayerSeat } = props;
  
  return (
    <div>
      <h3>Tic Tac Toe - Observer View</h3>
      <TicTacToeGrid 
        myPlayerSeat={observedPlayerSeat || 'p1'}
        gameState={gameState}
        onGameAction={() => {
          // Observer view is read-only, no actions allowed
        }}
      />
    </div>
  );
};
