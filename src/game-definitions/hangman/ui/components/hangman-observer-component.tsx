import { HangmanGameState } from '../../engine/hangman-engine';
import { ObserverComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { HangmanRepresentation } from '../representation/hangman-representation';
import { Typography, Stack } from '@bfg-engine/ui/bfg-ui';
import { convertDbGameTableActionToHangmanGameAction } from '../hangman-action-converter';

export const HangmanObserverComponent = (props: ObserverComponentProps<HangmanGameState>) => {
  const { gameState, observedPlayerSeat, latestGameAction } = props;
  
  const mostRecentAction = convertDbGameTableActionToHangmanGameAction(latestGameAction);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Hangman - Observer View</Typography>
      <HangmanRepresentation 
        myPlayerSeat={observedPlayerSeat || 'p1'}
        gameState={gameState}
        mostRecentAction={mostRecentAction}
      />
    </Stack>
  );
};
