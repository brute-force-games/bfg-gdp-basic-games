import { DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { isHostActionSource, isPlayerActionSource } from "@bfg-engine/models/game-table/utils";
import { HangmanGameAction } from "../engine/hangman-engine";
import { HangmanPlayerActionEncoder, HangmanHostActionEncoder } from "../engine/encoders";

/**
 * Converts a DbGameTableAction to a HangmanGameAction by decoding the actionStr
 * based on the action source and type.
 */
export const convertDbGameTableActionToHangmanGameAction = (
  dbAction: DbGameTableAction | null
): HangmanGameAction | null => {
  if (!dbAction) {
    return null;
  }

  try {
    const source = dbAction.source;
    
    // Decode the action based on the source
    if (isHostActionSource(source)) {
      // For host actions, use the host action encoder
      const decodedAction = HangmanHostActionEncoder.decode(dbAction.actionStr);
      if (!decodedAction) {
        console.warn('Failed to decode host action:', dbAction.actionStr);
        return null;
      }
      
      // Convert host action to game action format
      return {
        actionType: 'game-table-action-host-action',
        wordSource: decodedAction.wordSource
      } as HangmanGameAction;
    }
    
    if (isPlayerActionSource(source)) {
      // For player actions, use the player action encoder
      const decodedAction = HangmanPlayerActionEncoder.decode(dbAction.actionStr);
      if (!decodedAction) {
        console.warn('Failed to decode player action:', dbAction.actionStr);
        return null;
      }
      
      // Convert player action to game action format based on action type
      if (decodedAction.playerActionType === 'game-table-action-player-picks-hidden-word') {
        return {
          actionType: 'game-table-action-player-picks-hidden-word',
          seat: decodedAction.playerSeat,
          hiddenWordInfo: decodedAction.hiddenWordInfo
        } as HangmanGameAction;
      } else if (decodedAction.playerActionType === 'game-table-action-player-guess-letter') {
        return {
          actionType: 'game-table-action-player-guess-letter',
          seat: decodedAction.playerSeat,
          guess: decodedAction.guess
        } as HangmanGameAction;
      } else if (decodedAction.playerActionType === 'game-table-action-player-cancel-game') {
        return {
          actionType: 'game-table-action-player-cancel-game',
          seat: decodedAction.playerSeat,
          cancellationReason: decodedAction.cancellationReason
        } as HangmanGameAction;
      }
    }
    
    console.warn('Unknown action source or type:', source, dbAction.actionType);
    return null;
  } catch (error) {
    console.error('Error converting DbGameTableAction to HangmanGameAction:', error);
    return null;
  }
};
