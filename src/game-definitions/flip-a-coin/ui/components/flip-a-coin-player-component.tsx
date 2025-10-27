import { FlipACoinPlayerAction, FlipACoinGameState } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { FlipACoinInput } from "../flip-a-coin-input";
import { PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { convertFromDbGameTableActionToGameSpecificAction } from "../../engine/engine-utils";
import { Box, Stack } from "@bfg-engine/ui/bfg-ui";


export const FlipACoinPlayerComponent = (
  props: PlayerComponentProps<FlipACoinGameState, FlipACoinPlayerAction>
) => {
  const { currentPlayerSeat, gameState, latestGameAction, onPlayerAction } = props;

  const mostRecentAction = latestGameAction !== null ?
    convertFromDbGameTableActionToGameSpecificAction(latestGameAction) :
    null;

  return (
    <Box>
      <Stack spacing={3}>
        <FlipACoinRepresentation 
          myPlayerSeat={currentPlayerSeat} 
          gameState={gameState} 
          mostRecentAction={mostRecentAction}
        />
        <FlipACoinInput 
          myPlayerSeat={currentPlayerSeat} 
          gameState={gameState} 
          mostRecentAction={mostRecentAction}
          onGameAction={onPlayerAction}
        />
      </Stack>
    </Box>
  )
}
