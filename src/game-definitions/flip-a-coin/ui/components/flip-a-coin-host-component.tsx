import { FlipACoinGameState, FlipACoinHostAction } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { convertFromDbGameTableActionToGameSpecificAction } from "../../engine/engine-utils";


export const FlipACoinHostComponent = (
  props: GameHostComponentProps<FlipACoinGameState, FlipACoinHostAction>
) => {
  const { gameState, latestGameAction } = props;

  const mostRecentAction = convertFromDbGameTableActionToGameSpecificAction(latestGameAction);

  return (
    <>
      <FlipACoinRepresentation 
        myPlayerSeat={null} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
      />
    </>
  )
}
