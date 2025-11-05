import { z } from "zod";
import { getWordInfoFromInternalWordList } from "./hangman-engine-utils";
import { BfgSupportedGameTitle, GameTableSeatSchema } from "@bfg-engine";
import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
import { GameTable, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { GameTableActionResult } from "@bfg-engine/models/game-table/table-phase";
import { BfgGameSpecificGameStateSchema, BfgGameSpecificTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { IBfgAllPublicKnowledgeGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";

export const HangmanGameName = 'Hangman' as BfgSupportedGameTitle;



export const HangmanResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-player-wins',
  'game-over-failure',
])

export type HangmanResolution = z.infer<typeof HangmanResolutionSchema>;


export const LetterChoiceSchema = z.enum([
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z',
])

export type LetterChoice = z.infer<typeof LetterChoiceSchema>;


// export const HANGMAN_WORD_SOURCE_PLAYER_PICKS = 'hangman-word-source-player-picks' as const;
// export const HANGMAN_WORD_SOURCE_HOST_CHOSES_RANDOM = 'hangman-word-source-host-chooses-random' as const;


export const HANGMAN_WORD_SOURCE_NOT_SET = 'hangman-word-source-not-set' as const;

// Legacy action constants for backward compatibility with UI components
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD = 'game-table-action-player-picks-hidden-word' as const;
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER = 'game-table-action-player-guess-letter' as const;
export const HANGMAN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME = 'game-table-action-player-cancel-game' as const;
export const HANGMAN_GAME_TABLE_ACTION_HOST_FINALIZES_HIDDEN_WORD = 'game-table-action-host-action' as const;

// Modern action constants
export const HANGMAN_HOST_ACTION_STARTS_GAME = 'game-table-action-host-starts-game' as const;
export const HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD = 'game-table-action-player-picks-hidden-word' as const;
export const HANGMAN_PLAYER_ACTION_GUESS_LETTER = 'game-table-action-player-guess-letter' as const;
export const HANGMAN_PLAYER_ACTION_CANCEL_GAME = 'game-table-action-player-cancel-game' as const;


export const HiddenWordInfoSchema = z.object({
  hiddenWord: z.string(),
  numberOfWrongGuessesToLose: z.number().min(1),
})

export type HiddenWordInfo = z.infer<typeof HiddenWordInfoSchema>;


export const PlayerHiddenWordSubmissionSchema = z.object({
  seat: GameTableSeatSchema,
  info: HiddenWordInfoSchema,
})

export type PlayerHiddenWordSubmission = z.infer<typeof PlayerHiddenWordSubmissionSchema>;


export const HangmanSetupGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(HANGMAN_HOST_ACTION_STARTS_GAME),
  wordSource: z.discriminatedUnion('source', [
    z.object({
      source: z.literal('player'),
      seat: GameTableSeatSchema,
    }),
    z.object({
      source: z.literal('internal-word-list'),
    }),
  ]),
})

export type HangmanSetupGame = z.infer<typeof HangmanSetupGameSchema>;


export const HangmanPlayerPicksHiddenWordSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD),
  hiddenWordInfo: HiddenWordInfoSchema,
  playerSeat: GameTableSeatSchema,
})

export type HangmanPlayerPicksHiddenWord = z.infer<typeof HangmanPlayerPicksHiddenWordSchema>;


export const HangmanPlayerGuessLetterSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(HANGMAN_PLAYER_ACTION_GUESS_LETTER),
  guess: LetterChoiceSchema,
  playerSeat: GameTableSeatSchema,
})

export type HangmanPlayerGuessLetter = z.infer<typeof HangmanPlayerGuessLetterSchema>;


export const HangmanPlayerCancelGameSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(HANGMAN_PLAYER_ACTION_CANCEL_GAME),
  cancellationReason: z.string(),
  playerSeat: GameTableSeatSchema,
})

export type HangmanPlayerCancelGame = z.infer<typeof HangmanPlayerCancelGameSchema>;


export const HangmanHostActionSchema = z.discriminatedUnion('hostActionType', [
  HangmanSetupGameSchema,
])

export type HangmanHostAction = z.infer<typeof HangmanHostActionSchema>;


export const HangmanPlayerActionSchema = z.discriminatedUnion('playerActionType', [
  HangmanPlayerPicksHiddenWordSchema,
  HangmanPlayerGuessLetterSchema,
  HangmanPlayerCancelGameSchema,
])

export type HangmanPlayerAction = z.infer<typeof HangmanPlayerActionSchema>;


// Legacy action schemas for backward compatibility with UI components
export const HangmanActionPlayerPicksHiddenWordSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_PICKS_HIDDEN_WORD),
  seat: GameTableSeatSchema,
  hiddenWordInfo: HiddenWordInfoSchema,
})

export type HangmanActionPlayerPicksHiddenWord = z.infer<typeof HangmanActionPlayerPicksHiddenWordSchema>;


export const HangmanActionGuessLetterSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_GUESS_LETTER),
  seat: GameTableSeatSchema,
  guess: LetterChoiceSchema,
})

export type HangmanActionGuessLetter = z.infer<typeof HangmanActionGuessLetterSchema>;


export const HangmanActionCancelGameSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_PLAYER_CANCEL_GAME),
  seat: GameTableSeatSchema,
  cancellationReason: z.string(),
})

export type HangmanActionCancelGame = z.infer<typeof HangmanActionCancelGameSchema>;


export const HangmanActionHostFinalizesHiddenWordActionSchema = z.object({
  actionType: z.literal(HANGMAN_GAME_TABLE_ACTION_HOST_FINALIZES_HIDDEN_WORD),
  wordSource: z.discriminatedUnion('source', [
    z.object({
      source: z.literal('player'),
      seat: GameTableSeatSchema,
    }),
    z.object({
      source: z.literal('internal-word-list'),
    }),
  ]),
})

export type HangmanActionHostFinalizesHiddenWordAction = z.infer<typeof HangmanActionHostFinalizesHiddenWordActionSchema>;


export const HangmanGameActionSchema = z.discriminatedUnion('actionType', [
  HangmanActionPlayerPicksHiddenWordSchema,
  HangmanActionGuessLetterSchema,
  HangmanActionCancelGameSchema,
  HangmanActionHostFinalizesHiddenWordActionSchema,
])

export type HangmanGameAction = z.infer<typeof HangmanGameActionSchema>;


export const PlayerStateSchema = z.object({
  lettersGuessed: z.array(LetterChoiceSchema),
})


export const HangmanGameStateSchema = BfgGameSpecificGameStateSchema.extend({
  isGameOver: z.boolean(),
  outcomeSummary: z.string().optional(),

  numberOfWrongGuesses: z.number(),

  playerHiddenWordSubmissions: z.array(PlayerHiddenWordSubmissionSchema)
    .default([]),

  hiddenWordSource: HangmanSetupGameSchema.nullable(),
  hiddenWordInfo: HiddenWordInfoSchema.nullable(),

  lettersGuessed: z.array(LetterChoiceSchema),
  hiddenWordState: z.string(),
  
  playerStates: z.record(GameTableSeatSchema, PlayerStateSchema)
    .optional()
    .default({
      'p1': { lettersGuessed: [], },
      'p2': { lettersGuessed: [], },
      'p3': { lettersGuessed: [], },
      'p4': { lettersGuessed: [], },
      'p5': { lettersGuessed: [], },
      'p6': { lettersGuessed: [], },
      'p7': { lettersGuessed: [], },
      'p8': { lettersGuessed: [], },
    }),
}).describe('Hangman');

export type HangmanGameState = z.infer<typeof HangmanGameStateSchema>;


const createInitialGameState = (
  _gameTable: GameTable,
  initialGameTableAction: BfgGameSpecificTableAction<HangmanHostAction>,
): HangmanGameState => {

  if (initialGameTableAction.gameSpecificAction.hostActionType !== HANGMAN_HOST_ACTION_STARTS_GAME) {
    throw new Error("Initial game table action must be a host start game");
  }

  // Create initial state with no word source - host will set it up
  const retVal: HangmanGameState = {
    isGameOver: false,
    outcomeSummary: undefined,
    numberOfWrongGuesses: 0,
    playerHiddenWordSubmissions: [],
    hiddenWordSource: null,
    hiddenWordInfo: null,
    lettersGuessed: [],
    hiddenWordState: "",
    playerStates: {
      'p1': { lettersGuessed: [], },
      'p2': { lettersGuessed: [], },
      'p3': { lettersGuessed: [], },
      'p4': { lettersGuessed: [], },
      'p5': { lettersGuessed: [], },
      'p6': { lettersGuessed: [], },
      'p7': { lettersGuessed: [], },
      'p8': { lettersGuessed: [], },
    },
  };

  return retVal;
}


const createInitialHangmanGameTableAction = (
  // _gameTable: NewGameTable,
): BfgGameSpecificTableAction<HangmanHostAction> => {
  return {
    actionType: HANGMAN_HOST_ACTION_STARTS_GAME,
    gameSpecificAction: {
      source: 'host',
      hostActionType: HANGMAN_HOST_ACTION_STARTS_GAME,
      wordSource: { source: 'internal-word-list' }, // Default to internal word list
    },
    gameTableActionId: BfgGameTableActionId.createId(),
    source: 'game-table-action-source-host',
  };
}


const _applyPlayerPicksHiddenWordAction = (
  gameState: HangmanGameState,
  gameAction: HangmanPlayerPicksHiddenWord,
): GameTableActionResult<HangmanGameState> => {
  
  const hiddenWord = gameAction.hiddenWordInfo.hiddenWord;
  const numberOfWrongGuessesToLose = gameAction.hiddenWordInfo.numberOfWrongGuessesToLose;

  const summary = `Player ${gameAction.playerSeat} chose ${hiddenWord} and set the number of wrong guesses to lose to ${numberOfWrongGuessesToLose}`;

  const updatedPlayerHiddenWordSubmissions = [
    ...gameState.playerHiddenWordSubmissions
      .filter(submission => submission.seat !== gameAction.playerSeat), 
    {
      seat: gameAction.playerSeat,
      info: gameAction.hiddenWordInfo,
    },
  ];

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: {
      ...gameState,
      playerHiddenWordSubmissions: updatedPlayerHiddenWordSubmissions,
    },
    gameSpecificStateSummary: summary,
  }
}


// const _applyHostChoosesHiddenWordSourceRandomAction = (
//   gameState: HangmanGameState,
//   gameAction: HangmanActionHostChoosesHiddenWordSourceRandom,
// ): GameTableActionResult<HangmanGameState> => {
  
//   const getHiddenWordInfo = (source: HangmanHiddenWordSource): HiddenWordInfo => {
//     if (source === 'use-horse') {
//       return {
//         hiddenWord: 'horse',
//         numberOfWrongGuessesToLose: 10,
//       };
//     }
    
//     const wordList = [
//       'mustang',
//       'dog',
//       'cat',
//       'bird',
//       'fish',
//     ];

//     const randomIndex = Math.floor(Math.random() * wordList.length);

//     return {
//       hiddenWord: wordList[randomIndex],
//       numberOfWrongGuessesToLose: 10,
//     };
//   }

//   const { hiddenWord, numberOfWrongGuessesToLose } = getHiddenWordInfo(gameAction.hiddenWordSource);
//   const summary = `Host chose ${hiddenWord} and set the number of wrong guesses to lose to ${numberOfWrongGuessesToLose}`;

//   return {
//     tablePhase: 'table-phase-game-in-progress',
//     gameSpecificState: {
//       ...gameState,
//       hiddenWordSetup: gameAction,
//       // Don't set hiddenWordInfo here - let the finalization action handle it
//     },
//     gameSpecificStateSummary: summary,
//   }
// }


const _applyPlayerGuessLetterAction = (
  gameState: HangmanGameState,
  gameAction: HangmanPlayerGuessLetter,
): GameTableActionResult<HangmanGameState> => {

  if (!gameState.hiddenWordInfo) {
    return {
      tablePhase: 'table-phase-error',
      gameSpecificState: gameState,
      gameSpecificStateSummary: `Letter guess not possible - hidden word not set`,
    }
  }

  const { guess } = gameAction;

  // Get all indexes where the guessed letter appears
  const letterGuessIndexes: number[] = [];
  const hiddenWord = gameState.hiddenWordInfo.hiddenWord;
  for (let i = 0; i < hiddenWord.length; i++) {
    if (hiddenWord[i] === guess) {
      letterGuessIndexes.push(i);
    }
  }
  const isGuessWrong = letterGuessIndexes.length === 0;
  const updatedLettersGuessed = [...gameState.lettersGuessed, guess];

  if (isGuessWrong) {
    const numberOfWrongGuesses = gameState.numberOfWrongGuesses + 1;
    const numWrongGuessesRemaining = gameState.hiddenWordInfo.numberOfWrongGuessesToLose - numberOfWrongGuesses;
    const outOfGuesses = numWrongGuessesRemaining <= 0;
  
    if (outOfGuesses) {
      return {
        tablePhase: 'table-phase-game-complete-no-winners',
        gameSpecificState: {
          ...gameState,
          numberOfWrongGuesses,
          lettersGuessed: updatedLettersGuessed,
        },
        gameSpecificStateSummary: `No wrong guesses remaining [out of ${numberOfWrongGuesses}] - final guess was ${guess}.`,
      }
    }

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        numberOfWrongGuesses,
        lettersGuessed: updatedLettersGuessed,
      },
      gameSpecificStateSummary: `Guess ${guess} was wrong - ${numWrongGuessesRemaining} wrong guesses remaining.`,
    }
  }

  // Update the hidden word state with the guessed letter at the correct positions
  const updatedHiddenWordState = gameState.hiddenWordState
    .split('')
    .map((char, index) => letterGuessIndexes.includes(index) ? guess : char)
    .join('');

  const isGameWon = !updatedHiddenWordState.includes('-');

  if (isGameWon) {
    return {
      tablePhase: 'table-phase-game-complete-with-winners',
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: `Player ${gameAction.playerSeat} won! The word was ${hiddenWord}`,
        lettersGuessed: updatedLettersGuessed,
        hiddenWordState: updatedHiddenWordState,
      },
      gameSpecificStateSummary: `Game won! The word was ${hiddenWord}`,
    }
  }

  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: {
      ...gameState,
      lettersGuessed: updatedLettersGuessed,
      hiddenWordState: updatedHiddenWordState,
    },
    gameSpecificStateSummary: `Guess ${guess} was correct - current word state is ${updatedHiddenWordState}`,
  }
}


const applyHangmanPlayerAction = async (
  _tableState: GameTable,
  gameState: HangmanGameState,
  playerAction: HangmanPlayerAction,
): Promise<GameTableActionResult<HangmanGameState>> => {

  console.log("APPLY HANGMAN PLAYER ACTION - GAME STATE", gameState);
  console.log("APPLY HANGMAN PLAYER ACTION - PLAYER ACTION", playerAction);

  if (playerAction.playerActionType === HANGMAN_PLAYER_ACTION_PICKS_HIDDEN_WORD) {
    const actionResult = _applyPlayerPicksHiddenWordAction(gameState, playerAction);
    return actionResult;
  } 

  if (playerAction.playerActionType === HANGMAN_PLAYER_ACTION_GUESS_LETTER) {
    const actionResult = _applyPlayerGuessLetterAction(gameState, playerAction);
    return actionResult;
  }

  if (playerAction.playerActionType === HANGMAN_PLAYER_ACTION_CANCEL_GAME) {
    return {
      tablePhase: 'table-phase-game-abandoned',
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: playerAction.cancellationReason,
      },
      gameSpecificStateSummary: playerAction.cancellationReason,
    }
  }

  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid player action: ${(playerAction as any).playerActionType}`,
  };
}


const applyHangmanHostAction = async (
  _tableState: GameTable,
  gameState: HangmanGameState,
  hostAction: HangmanHostAction,
): Promise<GameTableActionResult<HangmanGameState>> => {

  console.log("APPLY HANGMAN HOST ACTION - GAME STATE", gameState);
  console.log("APPLY HANGMAN HOST ACTION - HOST ACTION", hostAction);

  if (hostAction.hostActionType === HANGMAN_HOST_ACTION_STARTS_GAME) {
    // Create a new game state with the selected word source
    const getHiddenWordInfo = (): HiddenWordInfo => {
      if (hostAction.wordSource.source === 'player') {
        // Find the player submission
        const playerSubmission = gameState.playerHiddenWordSubmissions.find(
          submission => submission.seat === (hostAction.wordSource as any).seat
        );
        if (playerSubmission) {
          return playerSubmission.info;
        }
        // Fallback if player submission not found
        return {
          hiddenWord: 'DEFAULT',
          numberOfWrongGuessesToLose: 6,
        };
      }

      if (hostAction.wordSource.source === 'internal-word-list') {
        return getWordInfoFromInternalWordList();
      }

      throw new Error(`Invalid hidden word source`);
    }

    const hiddenWordInfo = getHiddenWordInfo();
    const hiddenWord = hiddenWordInfo.hiddenWord.toUpperCase();
    const numberOfWrongGuessesToLose = hiddenWordInfo.numberOfWrongGuessesToLose;
    const hiddenWordState = "-".repeat(hiddenWord.length);

    const newGameState: HangmanGameState = {
      ...gameState,
      hiddenWordSource: hostAction,
      hiddenWordInfo: { hiddenWord, numberOfWrongGuessesToLose },
      hiddenWordState,
      numberOfWrongGuesses: 0,
      lettersGuessed: [],
      isGameOver: false,
      outcomeSummary: undefined,
    };

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: newGameState,
      gameSpecificStateSummary: 'Game started',
    };
  }

  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid host action: ${hostAction.hostActionType}`,
  };
}


const getNextToActPlayers = (gameTable: GameTable, gameState: HangmanGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
    return [];
  }

  const nextPlayersToAct = getActivePlayerSeatsForGameTable(gameTable);

  return nextPlayersToAct;
}

const getPlayerDetailsLine = (gameState: HangmanGameState, playerSeat: GameTableSeat): React.ReactNode => {
  return `Player ${playerSeat} has ${gameState.playerStates?.[playerSeat]?.lettersGuessed.length} letters guessed`;
}


export const HangmanGameProcessor: IBfgAllPublicKnowledgeGameProcessor<
  HangmanGameState,
  HangmanPlayerAction,
  HangmanHostAction
> = {
  gameTitle: HangmanGameName,
  
  createGameSpecificInitialAction: createInitialHangmanGameTableAction,
  createGameSpecificInitialState: createInitialGameState,
  applyPlayerAction: applyHangmanPlayerAction,
  applyHostAction: applyHangmanHostAction,

  getNextToActPlayers: getNextToActPlayers,
  getPlayerDetailsLine: getPlayerDetailsLine,

  getAllPlayersPrivateKnowledge: () => null,
};
