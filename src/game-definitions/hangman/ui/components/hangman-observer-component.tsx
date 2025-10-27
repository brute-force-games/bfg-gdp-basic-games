import { HangmanGameState } from '../../engine/hangman-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { HangmanRepresentation } from '../representation/hangman-representation';

export const HangmanObserverComponent = (props: ObserverComponentProps<HangmanGameState>) => {
  const { gameState, observedPlayerSeat } = props;
  
  return (
    <div>
      <h3>Hangman - Observer View</h3>
      <HangmanRepresentation 
        myPlayerSeat={observedPlayerSeat || 'p1'}
        gameState={gameState}
        mostRecentAction={undefined}
      />
    </div>
  );
};
