import { FlipACoinGameState, FlipACoinHostAction } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { convertFromDbGameTableActionToGameSpecificAction } from "../../engine/engine-utils";
import { Box } from "@bfg-engine/ui/bfg-ui";


export const FlipACoinHostComponent = (
  props: GameHostComponentProps<FlipACoinGameState, FlipACoinHostAction>
) => {
  const { gameState, latestGameAction } = props;

  const mostRecentAction = convertFromDbGameTableActionToGameSpecificAction(latestGameAction);

  return (
    <Box>
      <FlipACoinRepresentation 
        myPlayerSeat={null} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
      />
    </Box>
  )
}
