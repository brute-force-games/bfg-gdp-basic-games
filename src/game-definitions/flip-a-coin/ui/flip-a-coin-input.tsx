import { GameTableSeat } from "@bfg-engine/models/internal/game-room-base";
import { FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT, FlipACoinPlayerAction, FlipACoinGameState, FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN, FlipACoinHostAction } from "../game-types";
import { Button, Box, Stack, Typography } from "@bfg-engine/ui/bfg-ui";
import type { BfgGameActionByPlayer } from "@bfg-engine/game-metadata/metadata-types/game-action-types";


interface FlipACoinInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: FlipACoinGameState;
  mostRecentAction: FlipACoinPlayerAction | FlipACoinHostAction | null;
  onGameAction: <PGA extends BfgGameActionByPlayer>(gameAction: PGA) => void;
}

export const FlipACoinInput = (props: FlipACoinInputProps) => {
  const { myPlayerSeat, gameState, onGameAction } = props;
  
  const chosenCoin = gameState.chosenCoin;
  const flipOutcome = gameState.flipResult;
  const myPlayerOutcomePreference = gameState.playerFlipResultPreferences?.find(pref => pref.seat === myPlayerSeat)?.preference ?? 'no-preference';


  const chooseCoin = (coinType: "penny" | "nickel" | "dime" | "quarter") => {
    const playerAction: FlipACoinPlayerAction = { 
      playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CHOOSE_COIN, 
      source: "player",
      playerSeat: myPlayerSeat,
      chosenCoin: coinType,
    } as FlipACoinPlayerAction;
    onGameAction(playerAction);
  }

  const preferOutcome = (outcome: "heads" | "tails" | "no-preference") => {
    const playerAction: FlipACoinPlayerAction = { 
      playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_PREFER_FLIP_RESULT,
      source: "player",
      playerSeat: myPlayerSeat,
      preferredFlipResult: outcome,
    } as FlipACoinPlayerAction;
    onGameAction(playerAction);
  }

  const doFlipCoin = () => {
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    
    const playerAction: FlipACoinPlayerAction = { 
      playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_FLIP_COIN,
      source: "player",
      playerSeat: myPlayerSeat,
      flipResult: outcome,
    } as FlipACoinPlayerAction;
    onGameAction(playerAction);
  }

  const doFinishGame = () => {
    if (flipOutcome === undefined) {
      const playerAction: FlipACoinPlayerAction = {
        playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
        source: "player",
        playerSeat: myPlayerSeat,
        cancellationReason: "Error - coin has not been flipped before someone can call it",
      } as FlipACoinPlayerAction;
      onGameAction(playerAction);
      return;
    }

    const playerAction: FlipACoinPlayerAction = { 
      playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CALL_IT_AND_FINISH_GAME,
      source: "player",
      playerSeat: myPlayerSeat,
      calledFlipResult: flipOutcome,
    } as FlipACoinPlayerAction;
    onGameAction(playerAction);
  }

  const doCancelGame = () => {
    const playerAction: FlipACoinPlayerAction = {
      playerActionType: FLIP_A_COIN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME,
      source: "player",
      playerSeat: myPlayerSeat,
      cancellationReason: `Flip cancelled by ${myPlayerSeat}`,
    } as FlipACoinPlayerAction;
    onGameAction(playerAction);
  }

  if (gameState.isGameOver) {
    return (
      <Box>
        <Typography variant="body1">Game Over</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h6">Choose Coin Type</Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            onClick={() => chooseCoin("penny")} 
            disabled={chosenCoin === "penny"}
          >
            Use Penny
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => chooseCoin("nickel")} 
            disabled={chosenCoin === "nickel"}
          >
            Use Nickel
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => chooseCoin("dime")} 
            disabled={chosenCoin === "dime"}
          >
            Use Dime
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => chooseCoin("quarter")} 
            disabled={chosenCoin === "quarter"}
          >
            Use Quarter
          </Button>
        </Stack>

        <Typography variant="h6">Prefer Outcome</Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            onClick={() => preferOutcome("heads")} 
            disabled={myPlayerOutcomePreference === "heads"}
          >
            Prefer Heads
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => preferOutcome("tails")} 
            disabled={myPlayerOutcomePreference === "tails"}
          >
            Prefer Tails
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => preferOutcome("no-preference")} 
            disabled={myPlayerOutcomePreference === "no-preference"}
          >
            No Preference
          </Button>
        </Stack>

        <Typography variant="h6">Game Actions</Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={doFlipCoin}
          >
            Flip Coin
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={doFinishGame} 
            disabled={flipOutcome === undefined}
          >
            Call the Flip
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={doCancelGame} 
            disabled={flipOutcome !== undefined}
          >
            Cancel the Flip
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
