import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { FlipACoinPlayerAction, FlipACoinGameState, FlipACoinHostAction } from "../engine/flip-a-coin-engine";
import { Box, Stack, Typography } from "@bfg-engine/ui/bfg-ui";



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
    gameState.playerFlipResultPreferences?.[myPlayerSeat];

  const getOutcomeResult = () => {
    if (gameState.flipResult === undefined) {
      return 'oo';
    }

    if (myPlayerSeat === null) {
      return ':|';
    }

    switch (gameState.playerFlipResultPreferences?.[myPlayerSeat]) {
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
