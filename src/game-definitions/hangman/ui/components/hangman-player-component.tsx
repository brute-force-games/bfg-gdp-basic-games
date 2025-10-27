import { HangmanGameState, HangmanPlayerAction, HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD, HANGMAN_PLAYER_ACTION_GUESS_LETTER, HANGMAN_PLAYER_ACTION_CANCEL_GAME } from '../../engine/hangman-engine';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { HangmanRepresentation } from '../representation/hangman-representation';
import { HangmanInput } from '../hangman-input';

export const HangmanPlayerComponent = (props: PlayerComponentProps<HangmanGameState, HangmanPlayerAction>) => {
  const { gameState, currentPlayerSeat, onPlayerAction } = props;
  
  return (
    <div>
      <h3>Hangman - Player View</h3>
      <HangmanRepresentation 
        myPlayerSeat={currentPlayerSeat}
        gameState={gameState}
        mostRecentAction={undefined as any}
      />
      <HangmanInput
        myPlayerSeat={currentPlayerSeat}
        gameState={gameState}
        mostRecentAction={undefined as any}
        onGameAction={(_, gameAction) => {
          // Convert old game action format to new player action format
          if (gameAction.actionType === HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD) {
            const playerAction: HangmanPlayerAction = {
              source: 'player',
              playerActionType: HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD,
              hiddenWordInfo: gameAction.hiddenWordInfo,
              playerSeat: currentPlayerSeat,
            };
            onPlayerAction(playerAction);
          } else if (gameAction.actionType === HANGMAN_PLAYER_ACTION_GUESS_LETTER) {
            const playerAction: HangmanPlayerAction = {
              source: 'player',
              playerActionType: HANGMAN_PLAYER_ACTION_GUESS_LETTER,
              guess: gameAction.guess,
              playerSeat: currentPlayerSeat,
            };
            onPlayerAction(playerAction);
          } else if (gameAction.actionType === HANGMAN_PLAYER_ACTION_CANCEL_GAME) {
            const playerAction: HangmanPlayerAction = {
              source: 'player',
              playerActionType: HANGMAN_PLAYER_ACTION_CANCEL_GAME,
              cancellationReason: gameAction.cancellationReason,
              playerSeat: currentPlayerSeat,
            };
            onPlayerAction(playerAction);
          }
        }}
      />
    </div>
  );
};
