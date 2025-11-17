import { BfgSupportedGameTitle, GameTableSeatSchema } from "@bfg-engine";
// import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
// import { GameTable, GameTableSeat, GameTableSeatSchema } from "@bfg-engine/models/game-table/game-table";
// import { GameTableActionResult, TABLE_PHASE_ERROR, TABLE_PHASE_GAME_COMPLETE_NO_WINNERS, TABLE_PHASE_GAME_COMPLETE_WITH_WINNERS, TABLE_PHASE_GAME_IN_PROGRESS } from "@bfg-engine/models/game-table/table-phase";
// import { BfgGameSpecificTableAction, DbGameTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import {
  GoFishHostAction,
  GO_FISH_HOST_ACTION_STARTS_GAME,
  GoFishHostGameState,
  GoFishPlayerHandState,
  GoFishPlayerAction,
  GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS,
  GoFishPlayerBoardState,
  GoFishPublicGameState,
  GoFishPlayerActionOutcome,
  GO_FISH_PLAYER_ACTION_OUTCOME_RECEIVED_CARDS,
  GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD,
  GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL,
  GoFishHostActionOutcome,
  GO_FISH_HOST_ACTION_OUTCOME_STARTS_GAME,
  GO_FISH_PLAYER_ACTION_DRAW_CARD
} from "../go-fish-types";
// import { IBfgGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";
import { PlayingCard, CardRank } from "@bfg-engine/game-stock/std-card-games/types";
import { removeCardsFromHand, getCardsOfRank } from "./engine-utils";
import { createShuffledDeck } from "@bfg-engine/game-stock/std-card-games/factories";
import { isHostActionSource, isPlayerActionSource } from "@bfg-engine/models/game-table/utils";
import type { IBfgGameProcessor } from "../../../../../bfg-engine/src/game-metadata/factories/complete-game-processor-factory";
import type { GameTableSeat } from "../../../../../bfg-engine/src/models/game-table/game-room-p2p";
import type { GameTable } from "../../../../../bfg-engine/src/models/game-table/game-table";
// import { GoFishHostActionEncoder, GoFishPlayerActionEncoder, GoFishPlayerActionOutcomeEncoder } from "./encoders";


export const GoFishGameName = 'Go Fish' as BfgSupportedGameTitle;

// // Game resolution states
// export const GoFishResolutionSchema = z.enum([
//   'game-in-progress',
//   'game-over-with-winner',
// ]);

// export type GoFishResolution = z.infer<typeof GoFishResolutionSchema>;

// // Action type constants
// export const GO_FISH_HOST_ACTION_STARTS_GAME = 'game-table-action-host-starts-game' as const;
// export const GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS = 'game-table-action-player-ask-for-cards' as const;
// export const GO_FISH_PLAYER_ACTION_DRAW_CARD = 'game-table-action-player-draw-card' as const;

// // Host action to start the game
// export const GoFishStartGameSchema = BfgGameImplHostActionSchema.extend({
//   hostActionType: z.literal(GO_FISH_HOST_ACTION_STARTS_GAME),
//   shuffledDeck: z.array(PlayingCardSchema),
//   initialHandSize: z.number(),
// });

// export type GoFishStartGame = z.infer<typeof GoFishStartGameSchema>;

// // Player action to ask another player for cards
// export const GoFishPlayerAskForCardsSchema = BfgGameImplPlayerActionSchema.extend({
//   playerActionType: z.literal(GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS),
//   playerSeat: GameTableSeatSchema,
//   targetPlayerSeat: GameTableSeatSchema,
//   requestedRank: CardRankSchema,
// });

// export type GoFishPlayerAskForCards = z.infer<typeof GoFishPlayerAskForCardsSchema>;

// // Player action to draw a card from the deck
// export const GoFishPlayerDrawCardSchema = BfgGameImplPlayerActionSchema.extend({
//   playerActionType: z.literal(GO_FISH_PLAYER_ACTION_DRAW_CARD),
//   playerSeat: GameTableSeatSchema,
// });

// export type GoFishPlayerDrawCard = z.infer<typeof GoFishPlayerDrawCardSchema>;

// // Union of all player actions
// export const GoFishPlayerActionSchema = z.discriminatedUnion('playerActionType', [
//   GoFishPlayerAskForCardsSchema,
//   GoFishPlayerDrawCardSchema,
// ]);

// export type GoFishPlayerAction = z.infer<typeof GoFishPlayerActionSchema>;

// // Union of all host actions
// export const GoFishHostActionSchema = z.discriminatedUnion('hostActionType', [
//   GoFishStartGameSchema,
// ]);

// export type GoFishHostAction = z.infer<typeof GoFishHostActionSchema>;

// // Player state in the game
// export const PlayerStateSchema = z.object({
//   hand: z.array(PlayingCardSchema),
//   completedSets: z.array(CardRankSchema),
//   score: z.number(),
// });

// export type PlayerState = z.infer<typeof PlayerStateSchema>;

// // Main game state
// export const GoFishGameStateSchema = BfgGameSpecificGameStateSchema.extend({
//   deck: z.array(PlayingCardSchema),
//   playerStates: z.record(GameTableSeatSchema, PlayerStateSchema),
//   currentPlayerSeat: GameTableSeatSchema,
//   lastAction: z.string().optional(),
//   resolution: GoFishResolutionSchema,
//   isGameOver: z.boolean(),
//   winningSeat: GameTableSeatSchema.optional(),
// }).describe('Go Fish');

// export type GoFishGameState = z.infer<typeof GoFishGameStateSchema>;

// Helper function to get initial hand size based on number of players
const getInitialHandSize = (numPlayers: number): number => {
  return numPlayers <= 3 ? 7 : 5;
};

// Create initial game action
const createInitialGoFishGameAction = (
  gameTable: GameTable,
  _lobbyState: GameLobby,
): BfgGameSpecificTableAction<GoFishHostAction> => {
  const activePlayers = getActivePlayerSeatsForGameTable(gameTable);
  const initialHandSize = getInitialHandSize(activePlayers.length);
  
  const shuffledDeck = createShuffledDeck();
  // const deck = createStandardDeck();
  // const shuffledDeck = shuffleArray(deck);
  
  
  const initialGameTableAction: GoFishHostAction = {
    source: 'host',
    hostActionType: GO_FISH_HOST_ACTION_STARTS_GAME,
    shuffledDeck,
    initialHandSize,
  };

  const gameTableActionId = BfgGameTableActionId.createId();

  const gameSpecificTableAction: BfgGameSpecificTableAction<GoFishHostAction> = {
    gameSpecificAction: initialGameTableAction,
    gameTableActionId: gameTableActionId,
    source: 'game-table-action-source-host',
    actionType: GO_FISH_HOST_ACTION_STARTS_GAME,
  };

  return gameSpecificTableAction;
};

// Create initial game state
const createInitialGameState = (
  gameTable: GameTable,
  initialGameTableAction: BfgGameSpecificTableAction<GoFishHostAction>,
): GoFishHostGameState => {
  if (initialGameTableAction.gameSpecificAction.hostActionType !== GO_FISH_HOST_ACTION_STARTS_GAME) {
    throw new Error("Initial game action must be a host starts game");
  }

  const { shuffledDeck, initialHandSize } = initialGameTableAction.gameSpecificAction;
  const activePlayers = getActivePlayerSeatsForGameTable(gameTable);
  
  // Deal cards to players
  const playerHandStates: Record<GameTableSeat, GoFishPlayerHandState> = {} as any;
  const playerBoardStates: Record<GameTableSeat, GoFishPlayerBoardState> = {} as any;
  let deckIndex = 0;
  
  for (const seat of activePlayers) {
    const hand: PlayingCard[] = [];
    for (let i = 0; i < initialHandSize; i++) {
      if (deckIndex < shuffledDeck.length) {
        hand.push(shuffledDeck[deckIndex]);
        deckIndex++;
      }
    }
    
    playerHandStates[seat] = {
      hand,
    };

    playerBoardStates[seat] = {
      completedSets: [],
      handSize: initialHandSize,
      score: 0,
    };
  }
  
  // Remaining deck after dealing
  const remainingDeck = shuffledDeck.slice(deckIndex);
  
  const initialGameState: GoFishHostGameState = {
    deck: remainingDeck,
    deckCount: remainingDeck.length,
    playerHandStates,
    playerBoardStates,
    currentPlayerSeat: activePlayers[0],
    lastAction: 'Game started',
    resolution: 'game-in-progress',
    isGameOver: false,
    winningSeats: [],
  };

  return initialGameState;
};

// Helper to check for complete sets in a hand and remove them
const checkAndRemoveCompleteSets = (playerState: GoFishPlayerHandState): {
  updatedHandState: GoFishPlayerHandState;
  newlyCompletedSets: CardRank[];
} => {
  const hand = playerState.hand;
  const rankCounts = new Map<CardRank, PlayingCard[]>();
  
  // Group cards by rank
  for (const card of hand) {
    const cards = rankCounts.get(card.rank) || [];
    cards.push(card);
    rankCounts.set(card.rank, cards);
  }
  
  // Find complete sets (4 of a kind)
  const newlyCompletedSets: CardRank[] = [];
  const cardsToRemove: PlayingCard[] = [];
  
  for (const [rank, cards] of rankCounts.entries()) {
    if (cards.length === 4) {
      newlyCompletedSets.push(rank);
      cardsToRemove.push(...cards);
    }
  }
  
  if (newlyCompletedSets.length === 0) {
    return {
      updatedHandState: playerState,
      newlyCompletedSets: [],
    };
  }
  
  const newHand = removeCardsFromHand(hand, cardsToRemove);
  
  return {
    updatedHandState: {
      hand: newHand,
    },
    newlyCompletedSets,
  };
};

// Get next player in turn order
const getNextPlayerSeat = (
  currentSeat: GameTableSeat,
  activePlayers: GameTableSeat[]
): GameTableSeat => {
  const currentIndex = activePlayers.indexOf(currentSeat);
  const nextIndex = (currentIndex + 1) % activePlayers.length;
  return activePlayers[nextIndex];
};

// Check if game is over
const checkGameOver = (gameState: GoFishHostGameState, activePlayers: GameTableSeat[]): {
  isGameOver: boolean;
  winningSeats: GameTableSeat[];
} => {
  // Game is over if any player has no cards left
  const anyPlayerOutOfCards = activePlayers.some(
    seat => {
      const thisPlayerHandState = gameState.playerHandStates[seat];
      if (!thisPlayerHandState) {
        return false;
      }
      return thisPlayerHandState.hand.length === 0;
    }
  );

  if (anyPlayerOutOfCards) {
    // Find winner with most sets
    let maxScore = -1;
    let winningSeats: GameTableSeat[] = [];

    for (const seat of activePlayers) {
      const thisPlayerBoardState = gameState.playerBoardStates[seat];
      if (!thisPlayerBoardState) {
        continue;
      }
      const score = thisPlayerBoardState.score;
      if (score > maxScore) {
        maxScore = score;
        winningSeats = [seat]; // Reset to just this player
      } else if (score === maxScore) {
        winningSeats.push(seat); // Add tie
      }
    }

    return { isGameOver: true, winningSeats };
  }

  return { isGameOver: false, winningSeats: [] };
};

// Apply player action: ask for cards
const applyGoFishPlayerAction = async (
  tableState: GameTable,
  gameState: GoFishHostGameState,
  playerAction: GoFishPlayerAction,
): Promise<GameTableActionResult<'player', GoFishHostGameState, GoFishPlayerActionOutcome>> => {
  
  const activePlayers = getActivePlayerSeatsForGameTable(tableState);

  const createErrorResult = (summary: string): GameTableActionResult<'player', GoFishHostGameState, GoFishPlayerActionOutcome> => {
    return {
      tablePhase: TABLE_PHASE_ERROR,
      actionSource: 'player',
      gameSpecificState: gameState,
      gameSpecificActionOutcome: {
        playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL,
        terminalMessage: summary,
      },
      gameSpecificStateSummary: summary,
    };
  };
  
  if (playerAction.playerActionType === GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS) {
    const { playerSeat, targetPlayerSeat, requestedRank } = playerAction;
    
    // Validate it's the player's turn
    if (gameState.currentPlayerSeat !== playerSeat) {
      return createErrorResult(`It's not ${playerSeat}'s turn`);
    }
    
    // Validate player has at least one card of the requested rank
    const playerHandState = gameState.playerHandStates[playerSeat];
    if (!playerHandState) {
      return createErrorResult(`${playerSeat} not in game`);
    }

    const playerHand = playerHandState.hand;
    
    // Get target player's cards of requested rank
    const targetPlayerHandState = gameState.playerHandStates[targetPlayerSeat];
    if (!targetPlayerHandState) {
      return createErrorResult(`${targetPlayerSeat} not in game`);
    }
    const targetPlayerHand = targetPlayerHandState.hand;
    const matchingCards = getCardsOfRank(targetPlayerHand, requestedRank);

    if (matchingCards.length > 0) {
      // Target has cards - transfer them
      const newTargetHand = removeCardsFromHand(targetPlayerHand, matchingCards);
      const newTargetHandState = {
        ...targetPlayerHandState,
        hand: newTargetHand,
      };
      const newPlayerHand = [...playerHand, ...matchingCards];
      
      let updatedPlayerHandState = {
        ...playerHandState,
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      const { updatedHandState, newlyCompletedSets } = checkAndRemoveCompleteSets(updatedPlayerHandState);
      updatedPlayerHandState = updatedHandState;

      const playerBoardState = gameState.playerBoardStates[playerSeat];
      if (!playerBoardState) {
        return createErrorResult(`${playerSeat} not in game`);
      }
      
      const newGameState: GoFishHostGameState = {
        ...gameState,
        // deck: gameState.deck, // Explicitly preserve deck
        playerHandStates: {
          ...gameState.playerHandStates,
          [playerSeat]: updatedPlayerHandState,
          [targetPlayerSeat]: newTargetHandState,
        },
        playerBoardStates: {
          ...gameState.playerBoardStates,
          [playerSeat]: {
            ...gameState.playerBoardStates[playerSeat],
            handSize: updatedPlayerHandState.hand.length,
            score: playerBoardState.score + newlyCompletedSets.length,
            completedSets: [...playerBoardState.completedSets, ...newlyCompletedSets],
          },
          [targetPlayerSeat]: {
            ...gameState.playerBoardStates[targetPlayerSeat],
            handSize: newTargetHand.length,
          },
        },
        lastAction: `${playerSeat} got ${matchingCards.length} ${requestedRank}(s) from ${targetPlayerSeat}${
          newlyCompletedSets.length > 0 ? ` and completed ${newlyCompletedSets.length} set(s)!` : ''
        }`,
        // Player gets another turn
      };

      // Check if game is over
      const gameOverCheck = checkGameOver(newGameState, activePlayers);

      if (gameOverCheck.isGameOver) {
        const winnerListString = gameOverCheck.winningSeats.map(seat => seat.toString()).join(', ');
        const winner0 = gameOverCheck.winningSeats[0];
        if (!winner0) {
          return {
            tablePhase: TABLE_PHASE_GAME_COMPLETE_NO_WINNERS,
            actionSource: 'player',
            gameSpecificState: newGameState,
            gameSpecificActionOutcome: {
              playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL,
              terminalMessage: 'No winner determined',
            },
            gameSpecificStateSummary: 'No winner',
          };
        }
        const winnerScore = newGameState.playerBoardStates[winner0]?.score ?? 0;

        return {
          tablePhase: TABLE_PHASE_GAME_COMPLETE_WITH_WINNERS,
          actionSource: 'player',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeats: gameOverCheck.winningSeats,
            resolution: 'game-over-with-winner',
          },
          gameSpecificActionOutcome: {
            playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_RECEIVED_CARDS,
            receivedCards: matchingCards,
          },
          gameSpecificStateSummary: `${winnerListString} win with ${winnerScore} sets!`,
        };
      }
      
      return {
        tablePhase: TABLE_PHASE_GAME_IN_PROGRESS,
        actionSource: 'player',
        gameSpecificState: newGameState,
        gameSpecificActionOutcome: {
          playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_RECEIVED_CARDS,
          receivedCards: matchingCards,
        },
        gameSpecificStateSummary: `${playerSeat} got ${matchingCards.length} ${requestedRank}(s) from ${targetPlayerSeat}`,
      };
    } else {
      // Go Fish! - Player must draw from deck
      if (gameState.deck.length === 0) {
        // No cards to draw - pass turn
        const nextPlayerSeat = getNextPlayerSeat(playerSeat, activePlayers);
        
        return {
          tablePhase: TABLE_PHASE_GAME_IN_PROGRESS,
          actionSource: 'player',
          gameSpecificState: {
            ...gameState,
            // deck: gameState.deck, // Explicitly preserve deck
            currentPlayerSeat: nextPlayerSeat,
            lastAction: `Go Fish! Deck is empty. Turn passes to ${nextPlayerSeat}`,
          },
          gameSpecificActionOutcome: {
            playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL,
            terminalMessage: 'Cannot draw card - deck is empty',
          },
          gameSpecificStateSummary: `Go Fish! Deck is empty. Turn passes to ${nextPlayerSeat}`,
        };
      }
      
      // Draw a card
      const drawnCard = gameState.deck[0];
      const newDeck = gameState.deck.slice(1);
      const newPlayerHand = [...playerHand, drawnCard];

      let updatedPlayerHandState = {
        ...gameState.playerHandStates[playerSeat],
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      const { updatedHandState, newlyCompletedSets } = checkAndRemoveCompleteSets(updatedPlayerHandState);
      updatedPlayerHandState = updatedHandState;
      
      const playerBoardState = gameState.playerBoardStates[playerSeat];
      if (!playerBoardState) {
        return createErrorResult(`${playerSeat} not in game`);
      }
      
      // If drawn card matches requested rank, player gets another turn
      const drawnMatchesRequest = drawnCard.rank === requestedRank;
      const nextPlayerSeat = drawnMatchesRequest 
        ? playerSeat 
        : getNextPlayerSeat(playerSeat, activePlayers);
      
      const newGameState: GoFishHostGameState = {
        ...gameState,
        deck: newDeck,
        deckCount: newDeck.length,
        playerHandStates: {
          ...gameState.playerHandStates,
          [playerSeat]: updatedPlayerHandState,
        },
        playerBoardStates: {
          ...gameState.playerBoardStates,
          [playerSeat]: {
            ...playerBoardState,
            handSize: updatedPlayerHandState.hand.length,
            score: playerBoardState.score + newlyCompletedSets.length,
            completedSets: [...playerBoardState.completedSets, ...newlyCompletedSets],
          },
        },
        currentPlayerSeat: nextPlayerSeat,
        lastAction: drawnMatchesRequest
          ? `Go Fish! ${playerSeat} drew a ${drawnCard.rank} and gets another turn${
              newlyCompletedSets.length > 0 ? ` and completed ${newlyCompletedSets.length} set(s)!` : ''
            }`
          : `Go Fish! ${playerSeat} drew a card. Turn passes to ${nextPlayerSeat}${
              newlyCompletedSets.length > 0 ? ` (${playerSeat} completed ${newlyCompletedSets.length} set(s)!)` : ''
            }`,
      };

      // Check if game is over
      const gameOverCheck = checkGameOver(newGameState, activePlayers);

      if (gameOverCheck.isGameOver) {
        const winnerListString = gameOverCheck.winningSeats.map(seat => seat.toString()).join(', ');
        const winner0 = gameOverCheck.winningSeats[0];
        if (!winner0) {
          return {
            tablePhase: TABLE_PHASE_GAME_COMPLETE_NO_WINNERS,
            actionSource: 'player',
            gameSpecificState: newGameState,
            gameSpecificActionOutcome: {
              playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_TERMINAL,
              terminalMessage: 'No winner determined',
            },
            gameSpecificStateSummary: 'No winner',
          };
        }
        const winnerScore = newGameState.playerBoardStates[winner0]?.score ?? 0;

        return {
          tablePhase: TABLE_PHASE_GAME_COMPLETE_WITH_WINNERS,
          actionSource: 'player',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeats: gameOverCheck.winningSeats,
            resolution: 'game-over-with-winner',
          },
          gameSpecificActionOutcome: {
            playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD,
            drawnCard: drawnCard,
            fishMyWish: drawnMatchesRequest,
          },
          gameSpecificStateSummary: `${winnerListString} wins with ${winnerScore} sets!`,
        };
      }
      
      return {
        tablePhase: 'table-phase-game-in-progress',
        actionSource: 'player',
        gameSpecificState: newGameState,
        gameSpecificActionOutcome: {
          playerActionOutcomeType: GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD,
          drawnCard: drawnCard,
          fishMyWish: drawnMatchesRequest,
        },
        gameSpecificStateSummary: newGameState.lastAction || 'Go Fish!',
      };
    }
  }
  
  return createErrorResult('Invalid player action');
};


// Apply host action
const applyGoFishHostAction = async (
  _tableState: GameTable,
  gameState: GoFishHostGameState,
  hostAction: GoFishHostAction,
): Promise<GameTableActionResult<'host', GoFishHostGameState, GoFishHostActionOutcome>> => {

  if (hostAction.hostActionType !== GO_FISH_HOST_ACTION_STARTS_GAME) {
    return {
      tablePhase: TABLE_PHASE_ERROR,
      actionSource: 'host',
      gameSpecificState: gameState,
      gameSpecificActionOutcome: {
        hostActionOutcomeType: 'terminal-host-action',
        terminalMessage: 'Invalid host action: ' + hostAction.hostActionType,
      },
      gameSpecificStateSummary: 'Invalid host action',
    };
  }

  const gameSpecificActionOutcome: GoFishHostActionOutcome = {
    hostActionOutcomeType: GO_FISH_HOST_ACTION_OUTCOME_STARTS_GAME,
    shuffledDeck: gameState.deck,
    initialHandSize: hostAction.initialHandSize,
  };
  
  // Host action is only for initialization
  return {
    tablePhase: TABLE_PHASE_GAME_IN_PROGRESS,
    actionSource: 'host',
    gameSpecificState: gameState,
    gameSpecificActionOutcome,
    gameSpecificStateSummary: 'Host action processed',
  };
};

// Get next players to act
const getNextToActPlayers = (_gameTable: GameTable, gameState: GoFishPublicGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
    return [];
  }

  // Defensive check in case currentPlayerSeat is undefined
  if (!gameState.currentPlayerSeat) {
    console.warn('getNextToActPlayers: currentPlayerSeat is undefined', gameState);
    return [];
  }

  return [gameState.currentPlayerSeat];
};

// Get player details for display
const getPlayerDetailsLine = (gameState: GoFishPublicGameState, playerSeat: GameTableSeat): React.ReactNode => {
  const playerState = gameState.playerBoardStates[playerSeat];
  if (!playerState) {
    return `${playerSeat}: Not in game`;
  }
  
  return `${playerSeat}: ${playerState.handSize} cards, ${playerState.score} sets`;
};


const getAllPlayersPrivateKnowledge = (_gameTable: GameTable, gameState: GoFishHostGameState): Map<GameTableSeat, GoFishPlayerHandState> | null => {
  const privateKnowledge: Map<GameTableSeat, GoFishPlayerHandState> = new Map();

  for (const seat of Object.keys(gameState.playerHandStates)) {
    const playerSeat = GameTableSeatSchema.parse(seat);
    const playerHandState = gameState.playerHandStates[playerSeat];
    if (!playerHandState) {
      console.warn('⚠️ Go Fish: Player hand state not found for seat', playerSeat);
      continue;
    }

    // Validate that the hand state has the expected structure
    if (!playerHandState.hand || !Array.isArray(playerHandState.hand)) {
      console.error('❌ Go Fish: Invalid player hand state for seat', playerSeat, ':', playerHandState);
      continue;
    }

    privateKnowledge.set(playerSeat, playerHandState);
  }

  console.log('🎮 Go Fish: Returning private knowledge for', privateKnowledge.size, 'players');
  return privateKnowledge;
};

const summarizeGoFishGameAction = (gameAction: DbGameTableAction): string => {

  if (isHostActionSource(gameAction.source)) {
    const hostAction = GoFishHostActionEncoder.decode(gameAction.actionStr) as GoFishHostAction;
    return `Go Fish! Host action: ${hostAction.hostActionType} - ${hostAction.initialHandSize} cards`;
  }

  if (isPlayerActionSource(gameAction.source)) {
    const playerAction = GoFishPlayerActionEncoder.decode(gameAction.actionStr);
    if (!playerAction) {
      throw new Error('Failed to decode player action: ' + gameAction.actionStr);
    }

    const actionOutcome = gameAction.actionOutcomeStr ? 
      GoFishPlayerActionOutcomeEncoder.decode(gameAction.actionOutcomeStr) :
      null;
    if (!actionOutcome) {
      throw new Error('Failed to decode player action outcome: ' + gameAction.actionOutcomeStr);
    }

    switch (playerAction.playerActionType) {
      case GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS: {
        const playerSeat = playerAction.playerSeat;
        const targetPlayerSeat = playerAction.targetPlayerSeat;
        return `${playerSeat} asked for ${playerAction.requestedRank} from ${targetPlayerSeat}`;
      }
      case GO_FISH_PLAYER_ACTION_DRAW_CARD: {
        const playerSeat = playerAction.playerSeat;
        if (actionOutcome.playerActionOutcomeType !== GO_FISH_PLAYER_ACTION_OUTCOME_DRAW_CARD) {
          throw new Error('Unrecognized player action outcome type: ' + actionOutcome.playerActionOutcomeType);
        }
        const drawnCard = actionOutcome.drawnCard;
        return `${playerSeat} drew a ${drawnCard.rank}${drawnCard.suit} from the deck`;
      }
      default:
        throw new Error('Unrecognized player action type');
    }
  }

  throw new Error('Unrecognized game action source: ' + gameAction.source);
};


// Game processor implementation
const goFishProcessorImplementation: IBfgGameProcessor<
  GoFishPublicGameState,
  GoFishHostGameState,
  GoFishPlayerAction,
  GoFishPlayerActionOutcome,
  GoFishHostAction,
  GoFishHostActionOutcome,
  GoFishPlayerHandState
> = {
  gameTitle: GoFishGameName,

  createGameSpecificInitialAction: createInitialGoFishGameAction,
  createGameSpecificInitialState: createInitialGameState,
  applyPlayerAction: applyGoFishPlayerAction,
  applyHostAction: applyGoFishHostAction,

  getNextToActPlayers: getNextToActPlayers,
  getPlayerDetailsLine: getPlayerDetailsLine,
  getAllPlayersPrivateKnowledge,
  summarizeGameAction: summarizeGoFishGameAction,
};

export const GoFishGameProcessor = goFishProcessorImplementation;

// Helper function to get current player
export const getCurrentPlayer = (gameState: GoFishPublicGameState): GameTableSeat => {
  return gameState.currentPlayerSeat;
};

