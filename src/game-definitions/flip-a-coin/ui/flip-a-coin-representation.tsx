import { GameTableSeat } from "@bfg-engine/models/internal/game-room-base";
import { Box, Stack, Typography } from "@bfg-engine/ui/bfg-ui";
import type { FlipACoinPlayerAction, FlipACoinGameState, FlipACoinHostAction } from "../game-types";



interface FlipACoinRepresentationProps {
  myPlayerSeat: GameTableSeat | null;
  gameState: FlipACoinGameState;
  mostRecentAction: FlipACoinPlayerAction | FlipACoinHostAction | null;
}

export const FlipACoinRepresentation = (props: FlipACoinRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  console.log('FlipACoinRepresentation', props);

  if (gameState.isGameOver) {
    return (
      <Box>
        <Typography variant="h6" color="primary">
          Game is complete - {gameState.outcomeSummary}
        </Typography>
      </Box>
    );
  }

  const preferredOutcome = myPlayerSeat === null ?
    "Just watching" :
    gameState.playerFlipResultPreferences?.find(pref => pref.seat === myPlayerSeat)?.preference ?? 'no-preference';

  const getOutcomeResult = () => {
    if (gameState.flipResult === undefined) {
      return 'oo';
    }

    if (myPlayerSeat === null) {
      return ':|';
    }

    const preference = gameState.playerFlipResultPreferences?.find(pref => pref.seat === myPlayerSeat)?.preference ?? 'no-preference';
    switch (preference) {
      case 'heads':
        return gameState.flipResult === 'heads' ? ':D' : ':(';
      case 'tails':
        return gameState.flipResult === 'tails' ? ':D' : ':(';
      case undefined:
      case 'no-preference':
      default:
        return ':|';
    }
  }

  const coinType = gameState.chosenCoin;
  const outcomeResult = getOutcomeResult();

  if (gameState.isFlipped) {
    return (
      <Box>
        <Stack spacing={2}>
          <Typography variant="h6">
            A {coinType} was flipped and got {gameState.flipResult}
          </Typography>
          <Typography variant="body1">
            My preferred outcome: {preferredOutcome}
          </Typography>
          <Typography variant="h4" color={outcomeResult === ':(' ? 'error' : 'primary'}>
            {outcomeResult}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h6">
          Flipping a {coinType}
        </Typography>
        <Typography variant="body1">
          My preferred outcome: {preferredOutcome}
        </Typography>
      </Stack>
    </Box>
  );
}
