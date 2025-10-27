import { HangmanGameState, HangmanHostAction, HANGMAN_HOST_ACTION_STARTS_GAME } from '../../engine/hangman-engine';
import { GameHostComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { HangmanRepresentation } from '../representation/hangman-representation';
import { isHangmanGuessingActive } from '../hangman-utils';
import { useState } from "react";
import { Button, Card, Select, Stack, Typography, Alert, Container } from '@bfg-engine/ui/bfg-ui';
import { convertDbGameTableActionToHangmanGameAction } from '../hangman-action-converter';


export const HangmanHostComponent = (props: GameHostComponentProps<HangmanGameState, HangmanHostAction>) => {
  const { gameState, onHostAction, latestGameAction } = props;
  const gameActive = isHangmanGuessingActive(gameState);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mostRecentAction = convertDbGameTableActionToHangmanGameAction(latestGameAction);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleConfirmWordSource = () => {
    if (!selectedOption) {
      setErrorMessage("Please select a word source first!");
      return;
    }

    // Clear any previous error
    setErrorMessage(null);

    // Create the initial game action with word source
    let initialGameAction: HangmanHostAction;

    if (selectedOption === 'internal-word-list') {
      initialGameAction = {
        source: 'host',
        hostActionType: HANGMAN_HOST_ACTION_STARTS_GAME,
        wordSource: { source: 'internal-word-list' }
      };
    } else {
      // selectedOption should be a player seat
      initialGameAction = {
        source: 'host',
        hostActionType: HANGMAN_HOST_ACTION_STARTS_GAME,
        wordSource: { source: 'player', seat: selectedOption as any }
      };
    }

    onHostAction(initialGameAction);
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={4} alignItems="center">
        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>{errorMessage}</Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setErrorMessage(null)}
                style={{ minWidth: 'auto', padding: '4px' }}
              >
                ×
              </Button>
            </Stack>
          </Alert>
        )}

        {/* Game Status Section */}
        {gameActive ? (
          <Alert severity="success">
            <Typography variant="h6">
              Game Active - Current Word: {gameState.hiddenWordState || "Not set"}
            </Typography>
          </Alert>
        ) : gameState.isGameOver ? (
          <Alert severity={gameState.outcomeSummary?.includes('won') ? 'success' : 'error'}>
            <Typography variant="h6">
              Game Over - {gameState.outcomeSummary || "Game completed"}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="info">
            <Typography variant="h6">
              Waiting for game to start...
            </Typography>
          </Alert>
        )}

        {/* Host Controls Section - Only show when game is NOT active and NOT over */}
        {!gameActive && !gameState.isGameOver && (
          <Card>
            <Stack spacing={3} style={{ padding: "24px" }}>
              <Typography variant="h5" color="primary" align="center">
                Host Controls - Word Setup
              </Typography>
              
              <Stack spacing={2}>
                <Typography variant="subtitle1" align="center">
                  Choose Word Source:
                </Typography>
                
                {/* Word Source Selection */}
                <Stack direction="row" spacing={2} alignItems="flex-end" flexWrap="wrap" justifyContent="center">
                  <Select
                    value={selectedOption || ''}
                    onChange={(e) => handleOptionChange(e.target.value)}
                    label="Word Source"
                    fullWidth
                    style={{ minWidth: "250px" }}
                  >
                    <option value="">Select word source...</option>
                    <option value="internal-word-list">Internal Word List</option>
                    {gameState.playerHiddenWordSubmissions.map((submission) => (
                      <option key={submission.seat} value={submission.seat}>
                        Player {submission.seat} - "{submission.info.hiddenWord}"
                      </option>
                    ))}
                  </Select>

                  {/* Confirmation Button */}
                  <Button
                    onClick={handleConfirmWordSource}
                    disabled={!selectedOption}
                    variant="contained"
                    color="success"
                    size="large"
                    style={{ minWidth: "200px" }}
                  >
                    Confirm & Start Game
                  </Button>
                </Stack>
              </Stack>

              {/* Information Display */}
              <Stack spacing={1}>
                <Typography variant="body2" color="secondary" align="center">
                  • <strong>Internal Word List:</strong> Randomly selects from mustang, dog, cat, bird, fish
                </Typography>
                <Typography variant="body2" color="secondary" align="center">
                  • <strong>Player's Word:</strong> Uses a word submitted by a player
                </Typography>
                {gameState.playerHiddenWordSubmissions.length > 0 && (
                  <Typography variant="body2" align="center" style={{ fontWeight: "bold", color: "#28a745" }}>
                    Available player submissions: {gameState.playerHiddenWordSubmissions.length}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Game State Debug Info (only show when game is active) */}
        {gameActive && (
          <Card>
            <Stack spacing={2} style={{ padding: "16px" }}>
              <Typography variant="h6" align="center">Current Game State</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="secondary">
                  <strong>Hidden Word:</strong> {gameState.hiddenWordInfo?.hiddenWord}
                </Typography>
                <Typography variant="body2" color="secondary">
                  <strong>Current State:</strong> {gameState.hiddenWordState}
                </Typography>
                <Typography variant="body2" color="secondary">
                  <strong>Wrong Guesses:</strong> {gameState.numberOfWrongGuesses} / {gameState.hiddenWordInfo?.numberOfWrongGuessesToLose}
                </Typography>
                <Typography variant="body2" color="secondary">
                  <strong>Letters Guessed:</strong> {gameState.lettersGuessed.join(', ') || 'None'}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Game Representation */}
        <HangmanRepresentation 
          myPlayerSeat={'p1'}
          gameState={gameState}
          mostRecentAction={mostRecentAction}
        />
      </Stack>
    </Container>
  );
};
