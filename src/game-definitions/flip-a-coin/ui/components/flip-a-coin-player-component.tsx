import { FlipACoinPlayerAction, FlipACoinGameState } from "../../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "../flip-a-coin-representation";
import { FlipACoinInput } from "../flip-a-coin-input";
import { PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { convertFromDbGameTableActionToGameSpecificAction } from "../../engine/engine-utils";


export const FlipACoinPlayerComponent = (
  props: PlayerComponentProps<FlipACoinGameState, FlipACoinPlayerAction>
) => {
  const { currentPlayerSeat, gameState, latestGameAction, onPlayerAction } = props;

  const mostRecentAction = latestGameAction !== null ?
    convertFromDbGameTableActionToGameSpecificAction(latestGameAction) :
    null;

  return (
    <>
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
    </>
  )
}
