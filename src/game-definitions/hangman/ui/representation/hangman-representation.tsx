import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { HangmanGameAction, HangmanGameState } from "../../engine/hangman-engine";
import { HangmanStickFigure } from "./hangman-stick-figure";
import { getHiddenWordStatusLabel, isHangmanGuessingActive } from "../hangman-utils";
import { Alert, Card, Stack, Typography, Container } from '@bfg-engine/ui/bfg-ui';


interface HangmanRepresentationProps {
  myPlayerSeat: GameTableSeat | null;
  gameState: HangmanGameState;
  mostRecentAction: HangmanGameAction | null;
}

export const HangmanRepresentation = ({
  myPlayerSeat,
  gameState,
}: HangmanRepresentationProps) => {

  const gameActive = isHangmanGuessingActive(gameState);

  if (!gameActive && !gameState.isGameOver) {
    const hiddenWordStatusLabel = getHiddenWordStatusLabel(gameState, myPlayerSeat);

    return (
      <Container maxWidth="sm">
        <Alert severity="info">
          <Typography variant="h6" align="center">
            {hiddenWordStatusLabel}
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!gameState.hiddenWordInfo) {
    console.log('HangmanRepresentation: gameState', gameState);
    throw new Error("Hidden word info is required for hangman representation");
  }

  const maxWrongGuesses = gameState.hiddenWordInfo.numberOfWrongGuessesToLose;
  const wrongGuesses = gameState.numberOfWrongGuesses;

  return (
    <Container maxWidth="md">
      <Stack spacing={3} alignItems="center">
        {/* Game Outcome */}
        {gameState.isGameOver && (
          <Alert 
            severity={gameState.outcomeSummary?.includes('won') ? 'success' : 'error'}
            style={{ width: '100%' }}
          >
            <Typography variant="h6" align="center">
              {gameState.outcomeSummary}
            </Typography>
          </Alert>
        )}

        {/* Word Display */}
        {gameState.hiddenWordState && (
          <Card>
            <Stack spacing={2} style={{ padding: "20px" }}>
              <Typography variant="h4" align="center" style={{ 
                letterSpacing: '8px', 
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}>
                {gameState.hiddenWordState}
              </Typography>
            </Stack>
          </Card>
        )}

        {/* Stick Figure */}
        <Card>
          <Stack spacing={2} style={{ padding: "20px" }}>
            <HangmanStickFigure wrongGuesses={wrongGuesses} maxWrongGuesses={maxWrongGuesses} />
          </Stack>
        </Card>

        {/* Game Status */}
        <Card>
          <Stack spacing={2} style={{ padding: "16px" }}>
            <Typography variant="h6" align="center">Game Status</Typography>
            <Stack spacing={1}>
              <Typography variant="body1" align="center">
                <strong>Wrong Guesses:</strong> {wrongGuesses} / {maxWrongGuesses}
              </Typography>
              <Typography variant="body1" align="center">
                <strong>Letters Guessed:</strong> {gameState.lettersGuessed.join(', ') || 'None'}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
