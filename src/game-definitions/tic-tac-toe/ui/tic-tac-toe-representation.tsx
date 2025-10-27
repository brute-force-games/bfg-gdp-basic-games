import { TicTacToeGameState } from "../engine/tic-tac-toe-engine";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { Box, Typography, Stack } from "@bfg-engine/ui/bfg-ui";


interface TicTacToeRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: TicTacToeGameState;
}

export const TicTacToeRepresentation = (props: TicTacToeRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h6">Tic Tac Toe Representation</Typography>
        <Typography variant="body1">My Player Seat: {myPlayerSeat}</Typography>
        <Typography variant="body2" color="secondary">
          Game State: {JSON.stringify(gameState)}
        </Typography>
      </Stack>
    </Box>
  );
}
