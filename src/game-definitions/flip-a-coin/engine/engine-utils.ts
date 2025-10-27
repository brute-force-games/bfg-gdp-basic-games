import { isHostActionSource, isPlayerActionSource } from "@bfg-engine/models/game-table/utils";
import { FlipACoinHostAction, FlipACoinPlayerAction } from "./flip-a-coin-engine";
import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { FlipACoinHostActionEncoder, FlipACoinPlayerActionEncoder } from "./encoders";


export const convertFromDbGameTableActionToGameSpecificAction = (action: DbGameTableAction | null): FlipACoinPlayerAction | FlipACoinHostAction | null => {
  if (!action) {
    return null;
  }

  const { actionStr } = action;

  if (isHostActionSource(action.source)) {
    return FlipACoinHostActionEncoder.decode(actionStr) as FlipACoinHostAction;
  }
  
  if (isPlayerActionSource(action.source)) {
    return FlipACoinPlayerActionEncoder.decode(actionStr) as FlipACoinPlayerAction;
  }

  throw new Error('Invalid source for game table action: ' + action.source);
}
