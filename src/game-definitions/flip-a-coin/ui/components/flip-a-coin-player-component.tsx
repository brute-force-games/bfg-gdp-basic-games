import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { FlipACoinInput } from "../flip-a-coin-input";
import { PlayerComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { Box, Stack } from "@bfg-engine/ui/bfg-ui";
import type { FlipACoinPlayerAction, FlipACoinGameState } from "../../game-types";
import type { BfgGameStateForPlayer } from "@bfg-engine/game-metadata/metadata-types/game-state-types";


export const FlipACoinPlayerComponent = (
  props: PlayerComponentProps<BfgGameStateForPlayer>
) => {
  const { currentPlayerSeat, gameState, latestPlayerGameEvent, onPlayerAction } = props;

  const typedGameState = gameState as unknown as FlipACoinGameState;
  const mostRecentAction = latestPlayerGameEvent?.event as FlipACoinPlayerAction | undefined || null;

  return (
    <Box>
      <Stack spacing={3}>
        <FlipACoinRepresentation 
          myPlayerSeat={currentPlayerSeat} 
          gameState={typedGameState} 
          mostRecentAction={mostRecentAction}
        />
        <FlipACoinInput 
          myPlayerSeat={currentPlayerSeat} 
          gameState={typedGameState} 
          mostRecentAction={mostRecentAction}
          onGameAction={onPlayerAction}
        />
      </Stack>
    </Box>
  )
}
