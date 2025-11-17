import { FlipACoinGameState, FlipACoinPlayerAction, FlipACoinHostAction } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { ObserverComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components";
import { Box } from "@bfg-engine/ui/bfg-ui";
import type { BfgGameStateForWatcher } from "@bfg-engine/game-metadata/metadata-types/game-state-types";


export const FlipACoinObserverComponent = (props: ObserverComponentProps<BfgGameStateForWatcher>) => {
  const { gameState, observedPlayerSeat, latestWatcherGameEvent } = props;

  const typedGameState = gameState as unknown as FlipACoinGameState;
  const mostRecentAction = latestWatcherGameEvent?.event as FlipACoinPlayerAction | FlipACoinHostAction | undefined || null;

  return (
    <Box>
      <FlipACoinRepresentation 
        myPlayerSeat={observedPlayerSeat} 
        gameState={typedGameState} 
        mostRecentAction={mostRecentAction}
      />
    </Box>
  );
}
