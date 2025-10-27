import { TicTacToeGameState } from "../engine/tic-tac-toe-engine";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { Box, Typography, Stack } from "@bfg-engine/ui/bfg-ui";


interface TicTacToeInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: TicTacToeGameState;
}

export const TicTacToeInput = (props: TicTacToeInputProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h6">Tic Tac Toe Input</Typography>
        <Typography variant="body1">My Player Seat: {myPlayerSeat}</Typography>
        <Typography variant="body2" color="secondary">
          Game State: {JSON.stringify(gameState)}
        </Typography>
      </Stack>
    </Box>
  );
}
