import { isHostActionSource, isPlayerActionSource } from "@bfg-engine/models/game-table/utils";
import { TicTacToeHostAction, TicTacToePlayerAction } from "./tic-tac-toe-engine";
import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { TicTacToePlayerActionEncoder, TicTacToeHostActionEncoder } from "./encoders";


export const convertFromDbGameTableActionToGameSpecificAction = (action: DbGameTableAction | null): TicTacToePlayerAction | TicTacToeHostAction | null => {
  if (!action) {
    return null;
  }

  const { actionStr } = action;

  if (isHostActionSource(action.source)) {
    return TicTacToeHostActionEncoder.decode(actionStr) as TicTacToeHostAction;
  }
  
  if (isPlayerActionSource(action.source)) {
    return TicTacToePlayerActionEncoder.decode(actionStr) as TicTacToePlayerAction;
  }

  throw new Error('Invalid source for game table action: ' + action.source);
}
