
import { useState } from "react";
import { LetterChoice } from "../engine/hangman-engine";
import { Button, Card, Stack, Typography, Container } from '@bfg-engine/ui/bfg-ui';

interface HangmanLetterInputProps {
  disabledLetters: LetterChoice[];
  onSubmit?: (letter: LetterChoice) => void;
}

export const HangmanLetterInput = ({ 
  disabledLetters,
  onSubmit
}: HangmanLetterInputProps) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterChoice | null>(null);

  const alphabet: LetterChoice[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z',
  ];

  const handleLetterClick = (letter: LetterChoice) => {
    if (disabledLetters.includes(letter)) return;
    
    // If clicking the same letter, deselect it
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      // Select the new letter
      setSelectedLetter(letter);
    }
  };

  const handleSubmit = () => {
    if (selectedLetter && onSubmit) {
      onSubmit(selectedLetter);
      setSelectedLetter(null);
    }
  };

  const isLetterDisabled = (letter: LetterChoice) => {
    return disabledLetters.includes(letter);
  };

  const keyboardRows = [
    alphabet.slice(0, 7),   // A-G
    alphabet.slice(7, 14),  // H-N
    alphabet.slice(14, 21), // O-U
    alphabet.slice(21, 26), // V-Z
  ];

  return (
    <Container maxWidth="lg">
      <Card>
        <Stack spacing={3} style={{ padding: "20px" }}>
          <Typography variant="h6" align="center">Choose a Letter</Typography>
          
          <Stack direction="row" spacing={4} justifyContent="center" alignItems="flex-start">
            {/* Letter keyboard */}
            <Stack spacing={1}>
              {keyboardRows.map((row, rowIndex) => (
                <Stack key={rowIndex} direction="row" spacing={1} justifyContent="center">
                  {row.map((letter) => (
                    <Button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      disabled={isLetterDisabled(letter)}
                      variant={selectedLetter === letter ? "contained" : "outlined"}
                      color={selectedLetter === letter ? "primary" : "secondary"}
                      size="small"
                      style={{ 
                        minWidth: "40px", 
                        minHeight: "40px",
                        fontSize: "16px",
                        fontWeight: "bold"
                      }}
                    >
                      {letter}
                    </Button>
                  ))}
                </Stack>
              ))}
            </Stack>

            {/* Submit button */}
            <Stack justifyContent="center" style={{ minHeight: "200px" }}>
              <Button
                onClick={handleSubmit}
                disabled={!selectedLetter}
                variant="contained"
                color="success"
                size="large"
                style={{ minWidth: "120px" }}
              >
                Submit Guess
              </Button>
            </Stack>
          </Stack>

          {/* Already guessed letters */}
          {disabledLetters.length > 0 && (
            <Card>
              <Stack spacing={1} style={{ padding: "12px" }}>
                <Typography variant="body2" align="center" color="secondary">
                  <strong>Already guessed:</strong> {disabledLetters.join(", ")}
                </Typography>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  );
};