import { FlipACoinGameActionSchema, FlipACoinGameStateSchema } from "../engine/flip-a-coin-engine";
import { FlipACoinRepresentation } from "./flip-a-coin-representation";
import { FlipACoinInput } from "./flip-a-coin-input";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { GameStateActionInputProps, GameStateCombinationRepresentationAndInputProps, GameStateHostComponentProps, GameStateRepresentationProps } from "@bfg-engine/models/game-engine/bfg-game-engines";



export const createFlipACoinRepresentation = (
  props: GameStateRepresentationProps<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema>,
  // myPlayerSeat: GameTableSeat | null,
  // gameState: FlipACoinGameState,
  // mostRecentAction: FlipACoinGameAction
) => {
  console.log('cffdfreateFlipACoinRepresentation', props);
  const { myPlayerSeat, gameState, mostRecentAction } = props;
  return (
    <FlipACoinRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
    />
  );
  
}

export const createFlipACoinInput = (
  props: GameStateActionInputProps<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema>,
  // myPlayerSeat: GameTableSeat,
  // gameState: FlipACoinGameState,
  // mostRecentAction: FlipACoinGameAction,
  // onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {
  const { myPlayerSeat, gameState, mostRecentAction, onGameAction } = props;
  return (
    <FlipACoinInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
      onGameAction={onGameAction}
    />
  );
}


export const createFlipACoinCombinationRepresentationAndInput = (
  props: GameStateCombinationRepresentationAndInputProps<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema>,
  // myPlayerSeat: GameTableSeat,
  // gameState: FlipACoinGameState,
  // mostRecentAction: FlipACoinGameAction,
  // onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {
  const { myPlayerSeat, gameState, mostRecentAction, onGameAction } = props;

  console.log('cffdfcreateFlipACoinCombinationRepresentationAndInput', props);
  return (
    <>
      <FlipACoinRepresentation 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
      />
      <FlipACoinInput 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
        onGameAction={onGameAction}
      />
    </>
  )
}


export const createFlipACoinHostRepresentation = (
  props: GameStateHostComponentProps<typeof FlipACoinGameStateSchema, typeof FlipACoinGameActionSchema>,
  // gameTable: GameTable,
  // gameState: FlipACoinGameState,
  // mostRecentAction: FlipACoinGameAction,
  // _onGameAction: (gameState: FlipACoinGameState, gameAction: FlipACoinGameAction) => void
) => {

  const { gameTable, gameState, mostRecentAction } = props;
  const activePlayerSeats = getActivePlayerSeatsForGameTable(gameTable);

  console.log('cffdfcreateFlipACoinHostRepresentation', props);
  return (
    <>
      {activePlayerSeats.map(playerSeat => (
        <FlipACoinRepresentation 
          myPlayerSeat={playerSeat} 
          gameState={gameState} 
          mostRecentAction={mostRecentAction}
        />
      ))}
    </>
  )
}
