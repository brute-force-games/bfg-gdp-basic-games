import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { GameHostComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { Box } from "@bfg-engine/ui/bfg-ui";
import type { BfgGameStateForHost } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import type { FlipACoinGameState, FlipACoinHostAction } from "../../game-types";


export const FlipACoinHostComponent = (
  props: GameHostComponentProps<BfgGameStateForHost>
) => {
  const { gameState, latestHostGameEvent } = props;

  const typedGameState = gameState as unknown as FlipACoinGameState;
  const mostRecentAction = latestHostGameEvent?.event as FlipACoinHostAction | undefined || null;

  return (
    <Box>
      <FlipACoinRepresentation 
        myPlayerSeat={null} 
        gameState={typedGameState} 
        mostRecentAction={mostRecentAction}
      />
    </Box>
  )
}
