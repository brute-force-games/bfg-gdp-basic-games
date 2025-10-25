import { getCurrentPlayer, TicTacToeGameActionSchema, TicTacToeGameState, TicTacToeGameStateSchema, TicTacToeMove } from "../engine/tic-tac-toe-engine";
import { TicTacToeInput } from "./tic-tac-toe-input";
import { TicTacToeGrid } from "./tic-tac-toe-grid";
import { TicTacToeRepresentation } from "./tic-tac-toe-representation";
import { GameHistoryComponentProps, GameStateActionInputProps, GameStateCombinationRepresentationAndInputProps, GameStateHostComponentProps, GameStateRepresentationProps } from "@bfg-engine/models/game-engine/bfg-game-engines";


export const createTicTacToeRepresentation = (
  props: GameStateRepresentationProps<typeof TicTacToeGameStateSchema, typeof TicTacToeGameActionSchema>,
  // myPlayerSeat: GameTableSeat,
  // gameState: TicTacToeGameState,
  // _mostRecentAction: TicTacToeGameAction
) => {
  const { myPlayerSeat, gameState } = props;
  return (
    <TicTacToeRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
  
}

export const createTicTacToeInput = (
  props: GameStateActionInputProps<typeof TicTacToeGameStateSchema, typeof TicTacToeGameActionSchema>,
  // myPlayerSeat: GameTableSeat,
  // gameState: TicTacToeGameState,
  // _mostRecentAction: TicTacToeGameAction,
  // _onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {
  const { myPlayerSeat, gameState } = props;
  return (
    <TicTacToeInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
    />
  );
}


export const createTicTacToeComboRepresentationAndInput = (
  props: GameStateCombinationRepresentationAndInputProps<typeof TicTacToeGameStateSchema, typeof TicTacToeGameActionSchema>,
  // myPlayerSeat: GameTableSeat,
  // gameState: TicTacToeGameState,
  // _mostRecentAction: TicTacToeGameAction,
  // onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {

  const { myPlayerSeat, gameState, onGameAction } = props;
  return (
    <>
      <TicTacToeGrid
        myPlayerSeat={myPlayerSeat}
        gameState={gameState}
        onGameAction={onGameAction}
      />
    </>
  )
}


export const createTicTacToeHostRepresentation = (
  props: GameStateHostComponentProps<typeof TicTacToeGameStateSchema, typeof TicTacToeGameActionSchema>,
  // _gameTable: GameTable,
  // gameState: TicTacToeGameState,
  // _mostRecentAction: TicTacToeGameAction,
  // onGameAction: (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => void
) => {
  const { gameTable, gameState, onGameAction } = props;
  const currentPlayerSeat = getCurrentPlayer(gameState);
  
  const onTicTacToeAction = (gameState: TicTacToeGameState, gameAction: TicTacToeMove) => {
    onGameAction(gameTable, gameState, gameAction);
  }

  return (
    <TicTacToeGrid 
      myPlayerSeat={currentPlayerSeat}
      gameState={gameState}
      onGameAction={onTicTacToeAction}
    />
  )
}


export const createTicTacToeHistory = (
  _props: GameHistoryComponentProps<typeof TicTacToeGameStateSchema, typeof TicTacToeGameActionSchema>,
  // _myPlayerSeat: GameTableSeat,
  // _gameState: TicTacToeGameState,
  // _timeOrderedGameActions: BfgGameSpecificTableAction<TicTacToeGameAction>[]
) => {
  return (
    <>
      Tic Tac Toe History
      {/* {timeOrderedGameActions.map(action => (
        <TicTacToeActionComponent
          myPlayerSeat={myPlayerSeat}
          key={action.gameTableActionId}
          gameTable={gameTable}
          action={action.gameSpecificAction}
        />
      ))} */}
    </>
  )
}