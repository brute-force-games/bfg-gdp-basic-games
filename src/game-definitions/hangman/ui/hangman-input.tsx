import { useState } from "react";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { 
  HangmanGameAction, 
  HangmanGameState, 
  HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD, 
  HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER, 
  LetterChoice 
} from "../engine/hangman-engine";
import { getHiddenWordStatusLabel, isHangmanGuessingActive } from "./hangman-utils";
import { HangmanLetterInput } from "./hangman-letter-input";
import { Button, Card, TextField, Stack, Typography, Alert } from '@bfg-engine/ui/bfg-ui';


interface HangmanInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: HangmanGameState;
  mostRecentAction: HangmanGameAction;
  onGameAction: (gameState: HangmanGameState, gameAction: HangmanGameAction) => void;
}

export const HangmanInput = ({
  myPlayerSeat,
  gameState,
  onGameAction,
}: HangmanInputProps) => {
  
  const [showWordInput, setShowWordInput] = useState(false);
  const [hiddenWord, setHiddenWord] = useState("");
  const [wrongGuessesLimit, setWrongGuessesLimit] = useState(6);

  const handleSetHiddenWord = () => {
    if (hiddenWord.trim().length === 0) {
      alert("Please enter a hidden word!");
      return;
    }

    if (hiddenWord.trim().length < 2) {
      alert("Hidden word must be at least 2 characters long!");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(hiddenWord.trim())) {
      alert("Hidden word can only contain letters!");
      return;
    }

    if (wrongGuessesLimit < 1 || wrongGuessesLimit > 10) {
      alert("Wrong guesses limit must be between 1 and 10!");
      return;
    }

    // Dispatch the action to set the hidden word
    onGameAction(gameState, {
      actionType: HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD,
      seat: myPlayerSeat,
      hiddenWordInfo: {
        hiddenWord: hiddenWord.trim().toUpperCase(),
        numberOfWrongGuessesToLose: wrongGuessesLimit,
      },
    });

    setShowWordInput(false);
    setHiddenWord("");
    setWrongGuessesLimit(6);
  };

  const handleCancelWordInput = () => {
    setShowWordInput(false);
    setHiddenWord("");
    setWrongGuessesLimit(6);
  };

  const handleLetterGuessSubmit = (letter: LetterChoice) => {
    console.log("handleLetterGuessSubmit", letter);
    onGameAction(gameState, {
      actionType: HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER,
      seat: myPlayerSeat,
      guess: letter,
    });
  };

  const isGameActive = isHangmanGuessingActive(gameState);

  // If game is over, show game over message
  if (gameState.isGameOver) {
    return (
      <Stack spacing={2} style={{ padding: "20px", textAlign: "center" }}>
        <Alert 
          severity={gameState.outcomeSummary?.includes('won') ? 'success' : 'error'}
        >
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {gameState.outcomeSummary || "Game Over"}
          </Typography>
        </Alert>
        <Typography variant="body2" color="secondary">
          The word was: <strong>{gameState.hiddenWordInfo?.hiddenWord}</strong>
        </Typography>
      </Stack>
    );
  }

  if (isGameActive) {
    const disabledLetters = gameState.lettersGuessed;
    return (
      <HangmanLetterInput
        disabledLetters={disabledLetters}
        onSubmit={handleLetterGuessSubmit}
      />
    );
  }

  // const isHiddenWordInfoSet = gameState.hiddenWordInfo !== null;

  // const hiddenWordLabel = isHiddenWordInfoSet ? 
  //   "Waiting for host to confirm hidden word setup..." :
  //   "No hidden word has been set yet.";
  // if (!gameState.hiddenWordSetup && !gameState.hiddenWordInfo) {
  //   return (
  //     <div>
  //       Waiting for any hidden word info...
  //     </div>
  //   );
  // }

  const hiddenWordStatusLabel = getHiddenWordStatusLabel(gameState, myPlayerSeat);

  // if (!gameState.hiddenWordInfo) {
    if (!showWordInput) {
      return (
        <Stack spacing={2} style={{ padding: "20px", textAlign: "center" }}>
          <Typography variant="h6">
            {hiddenWordStatusLabel}
          </Typography>
          <Button 
            onClick={() => setShowWordInput(true)}
            variant="contained"
            color="primary"
            size="large"
          >
            Set Hidden Word
          </Button>
        </Stack>
      );
    }

    // if (gameState.hiddenWordSetup) {
    //   return (
    //     <div>
    //       Waiting for host to confirm hidden word setup...
    //     </div>
    //   );
    // }

    return (
      <Card>
        <Stack spacing={3} style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
          <Typography variant="h5" align="center">Set Hidden Word</Typography>
          
          <TextField
            label="Hidden Word"
            value={hiddenWord}
            onChange={(e) => setHiddenWord(e.target.value)}
            placeholder="Enter the word to guess"
            fullWidth
            maxLength={20}
          />

          <TextField
            label="Wrong Guesses Limit"
            type="number"
            value={wrongGuessesLimit}
            onChange={(e) => setWrongGuessesLimit(parseInt(e.target.value) || 6)}
            fullWidth
            min={1}
            max={10}
          />

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={handleSetHiddenWord}
              variant="contained"
              color="success"
            >
              Set Word
            </Button>
            <Button
              onClick={handleCancelWordInput}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Card>
    );
  // }

  // return (
  //   <div>
  //     <div>Hangman Input</div>
  //     <div>My Player Seat: {myPlayerSeat}</div>
  //     <div>Game State: {JSON.stringify(gameState)}</div>
  //     <div>Hangman Input End</div>
  //   </div>
  // );

  // const { myPlayerSeat, gameState, onGameAction } = props;
  
  // const chosenCoin = gameState.chosenCoin;
  // const flipOutcome = gameState.flipResult;
  // const myPlayerOutcomePreference = gameState.playerFlipResultPreferences[myPlayerSeat];


  // const chooseCoin = (coinType: "penny" | "nickel" | "dime" | "quarter") => {
  //   onGameAction(gameState, { 
  //     actionType: "game-table-action-player-choose-coin", 
  //     seat: myPlayerSeat,
  //     chosenCoin: coinType,
  //   });
  // }

  // const preferOutcome = (outcome: "heads" | "tails" | "no-preference") => {
  //   onGameAction(gameState, { 
  //     actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT,
  //     seat: myPlayerSeat,
  //     preferredFlipResult: outcome,
  //   });
  // }

  // const doFlipCoin = () => {
  //   const outcome = Math.random() < 0.5 ? "heads" : "tails";
    
  //   onGameAction(gameState, { 
  //     actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN,
  //     seat: myPlayerSeat,
  //     flipResult: outcome,
  //   });
  // }

  // const doFinishGame = () => {
  //   if (flipOutcome === undefined) {
  //     onGameAction(gameState, {
  //       actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
  //       seat: myPlayerSeat,
  //       cancellationReason: "Error - coin has not been flipped before someone can call it",
  //     });
  //     return;
  //   }

  //   onGameAction(gameState, { 
  //     actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME,
  //     seat: myPlayerSeat,
  //     calledFlipResult: flipOutcome,
  //   });
  // }

  // const doCancelGame = () => {
  //   onGameAction(gameState, {
  //     actionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
  //     seat: myPlayerSeat,
  //     cancellationReason: `Flip cancelled by ${myPlayerSeat}`,
  //   });
  // }

  // if (gameState.isGameOver) {
  //   return (
  //     <div>
  //       <div>--------------------------------</div>
  //     </div>
  //   );
  // }


  // return (
  //   <div>
  //     <div>--------------------------------</div>
  //     <div>
  //       <Button onClick={() => chooseCoin("penny")} disabled={chosenCoin === "penny"}>Use Penny</Button>
  //       <Button onClick={() => chooseCoin("nickel")} disabled={chosenCoin === "nickel"}>Use Nickel</Button>
  //       <Button onClick={() => chooseCoin("dime")} disabled={chosenCoin === "dime"}>Use Dime</Button>
  //       <Button onClick={() => chooseCoin("quarter")} disabled={chosenCoin === "quarter"}>Use Quarter</Button>
  //     </div>
  //     <div>
  //       <Button onClick={() => preferOutcome("heads")} disabled={myPlayerOutcomePreference === "heads"}>Prefer Heads</Button>
  //       <Button onClick={() => preferOutcome("tails")} disabled={myPlayerOutcomePreference === "tails"}>Prefer Tails</Button>
  //       <Button onClick={() => preferOutcome("no-preference")} disabled={myPlayerOutcomePreference === "no-preference"}>No Preference</Button>
  //     </div>
  //     <div>
  //       <Button onClick={doFlipCoin}>Flip Coin</Button>
  //       <Button onClick={doFinishGame} disabled={flipOutcome === undefined}>Call the Flip</Button>
  //       <Button onClick={doCancelGame} disabled={flipOutcome !== undefined}>Cancel the Flip</Button>
  //     </div>
  //   </div>
  // );
}
