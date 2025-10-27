import { FlipACoinGameState } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { ObserverComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { convertFromDbGameTableActionToGameSpecificAction } from "../../engine/engine-utils";


export const FlipACoinObserverComponent = (props: ObserverComponentProps<FlipACoinGameState>) => {
  const { gameState, observedPlayerSeat, latestGameAction } = props;

  const mostRecentAction = latestGameAction !== null ?
    convertFromDbGameTableActionToGameSpecificAction(latestGameAction) :
    null;

  return (
    <FlipACoinRepresentation 
      myPlayerSeat={observedPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
    />
  );
}
