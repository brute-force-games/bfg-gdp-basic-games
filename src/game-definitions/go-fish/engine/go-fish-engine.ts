import { BfgSupportedGameTitle } from "@bfg-engine";
import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
import { GameTable, GameTableSeat, GameTableSeatSchema } from "@bfg-engine/models/game-table/game-table";
import { GameTableActionResult } from "@bfg-engine/models/game-table/table-phase";
import { BfgGameSpecificTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { 
  PlayingCard, 
  CardRank,
  createStandardDeck,
  shuffleArray,
  getCardsOfRank,
  removeCardsFromHand,
} from "./engine-utils";
import { GoFishHostAction, GO_FISH_HOST_ACTION_STARTS_GAME, GoFishHostGameState, GoFishPlayerHandState, GoFishPlayerAction, GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS, GoFishPlayerBoardState, GoFishPublicGameState } from "../go-fish-types";
import { IBfgGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";

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
  
  const deck = createStandardDeck();
  const shuffledDeck = shuffleArray(deck);
  
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
      // completedSets: [],
      // score: 0,
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
const checkAndRemoveCompleteSets = (playerState: GoFishPlayerHandState): GoFishPlayerHandState => {
  const hand = playerState.hand;
  const rankCounts = new Map<CardRank, PlayingCard[]>();
  
  // Group cards by rank
  for (const card of hand) {
    const cards = rankCounts.get(card.rank) || [];
    cards.push(card);
    rankCounts.set(card.rank, cards);
  }
  
  // Find complete sets (4 of a kind)
  const completedSets: CardRank[] = [];
  const cardsToRemove: PlayingCard[] = [];
  
  for (const [rank, cards] of rankCounts.entries()) {
    if (cards.length === 4) {
      completedSets.push(rank);
      cardsToRemove.push(...cards);
    }
  }
  
  if (completedSets.length === 0) {
    return playerState;
  }
  
  const newHand = removeCardsFromHand(hand, cardsToRemove);
  
  return {
    hand: newHand,
    // completedSets: [...playerState.completedSets, ...completedSets],
    // score: playerState.score + completedSets.length,
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
  // Game is over if deck is empty and a player has no cards
  const deckEmpty = gameState.deck.length === 0;
  
  if (!deckEmpty) {
    return { isGameOver: false, winningSeats: [] };
  }
  
  // Check if any player has no cards
  const allPlayersOutOfCards = activePlayers.every(
    seat => {
      const thisPlayerHandState = gameState.playerHandStates[seat];
      if (!thisPlayerHandState) {
        return false;
      }
      return thisPlayerHandState.hand.length === 0;
    }
  );
  
  let winningSeats: GameTableSeat[] = [];

  if (allPlayersOutOfCards) {
    // Find winner with most sets
    let maxScore = -1;
    
    for (const seat of activePlayers) {
      const thisPlayerBoardState = gameState.playerBoardStates[seat];
      if (!thisPlayerBoardState) {
        continue;
      }
      const score = thisPlayerBoardState.score;
      if (score > maxScore) {
        maxScore = score;
        winningSeats.push(seat);
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
): Promise<GameTableActionResult<GoFishHostGameState>> => {
  
  const activePlayers = getActivePlayerSeatsForGameTable(tableState);
  
  if (playerAction.playerActionType === GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS) {
    const { playerSeat, targetPlayerSeat, requestedRank } = playerAction;
    
    // Validate it's the player's turn
    if (gameState.currentPlayerSeat !== playerSeat) {
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: `It's not ${playerSeat}'s turn`,
      };
    }
    
    // Validate player has at least one card of the requested rank
    const playerHandState = gameState.playerHandStates[playerSeat];
    if (!playerHandState) {
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: `${playerSeat} not in game`,
      };
    }

    const playerHand = playerHandState.hand;
    const hasRequestedRank = playerHand.some(card => card.rank === requestedRank);
    
    if (!hasRequestedRank) {
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: `${playerSeat} doesn't have any ${requestedRank}s to ask for`,
      };
    }
    
    // Get target player's cards of requested rank
    const targetPlayerHandState = gameState.playerHandStates[targetPlayerSeat];
    if (!targetPlayerHandState) {
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: `${targetPlayerSeat} not in game`,
      };
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
      
      let updatedPlayerHand = {
        ...playerHandState,
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      updatedPlayerHand = checkAndRemoveCompleteSets(updatedPlayerHand);

      const playerBoardState = gameState.playerBoardStates[playerSeat];
      if (!playerBoardState) {
        return {
          tablePhase: 'table-phase-error',
          gameSpecificState: gameState,
          gameSpecificStateSummary: `${playerSeat} not in game`,
        };
      }
      
      const newGameState: GoFishHostGameState = {
        ...gameState,
        playerHandStates: {
          ...gameState.playerHandStates,
          [playerSeat]: updatedPlayerHand,
          [targetPlayerSeat]: newTargetHandState,
        },
        playerBoardStates: {
          ...gameState.playerBoardStates,
          [playerSeat]: {
            ...gameState.playerBoardStates[playerSeat],
            handSize: updatedPlayerHand.hand.length,
            score: playerBoardState.score + 1,
          },
          [targetPlayerSeat]: {
            ...gameState.playerBoardStates[targetPlayerSeat],
            handSize: newTargetHand.length,
          },
        },
        lastAction: `${playerSeat} got ${matchingCards.length} ${requestedRank}(s) from ${targetPlayerSeat}`,
        // Player gets another turn
      };
      
      // Check if game is over
      const gameOverCheck = checkGameOver(newGameState, activePlayers);
      
      if (gameOverCheck.isGameOver) {
        const winnerListString = gameOverCheck.winningSeats.map(seat => seat.toString()).join(', ');
        const winner0 = gameOverCheck.winningSeats[0];
        if (!winner0) {
          return {
            tablePhase: 'table-phase-error',
            gameSpecificState: newGameState,
            gameSpecificStateSummary: 'No winner',
          };
        }
        const winnerScore = newGameState.playerBoardStates[winner0]?.score ?? 0;

        return {
          tablePhase: 'table-phase-game-complete-with-winners',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeats: gameOverCheck.winningSeats,
            resolution: 'game-over-with-winner',
          },
          gameSpecificStateSummary: `${winnerListString} win with ${winnerScore} sets!`,
        };
      }
      
      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: newGameState,
        gameSpecificStateSummary: `${playerSeat} got ${matchingCards.length} ${requestedRank}(s) from ${targetPlayerSeat}`,
      };
    } else {
      // Go Fish! - Player must draw from deck
      if (gameState.deck.length === 0) {
        // No cards to draw - pass turn
        const nextPlayerSeat = getNextPlayerSeat(playerSeat, activePlayers);
        
        return {
          tablePhase: 'table-phase-game-in-progress',
          gameSpecificState: {
            ...gameState,
            currentPlayerSeat: nextPlayerSeat,
            lastAction: `Go Fish! Deck is empty. Turn passes to ${nextPlayerSeat}`,
          },
          gameSpecificStateSummary: `Go Fish! Deck is empty. Turn passes to ${nextPlayerSeat}`,
        };
      }
      
      // Draw a card
      const drawnCard = gameState.deck[0];
      const newDeck = gameState.deck.slice(1);
      const newPlayerHand = [...playerHand, drawnCard];
      
      let updatedPlayerState = {
        ...gameState.playerHandStates[playerSeat],
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      updatedPlayerState = checkAndRemoveCompleteSets(updatedPlayerState);
      
      // If drawn card matches requested rank, player gets another turn
      const drawnMatchesRequest = drawnCard.rank === requestedRank;
      const nextPlayerSeat = drawnMatchesRequest 
        ? playerSeat 
        : getNextPlayerSeat(playerSeat, activePlayers);
      
      const newGameState: GoFishHostGameState = {
        ...gameState,
        deck: newDeck,
        playerHandStates: {
          ...gameState.playerHandStates,
          [playerSeat]: updatedPlayerState,
        },
        currentPlayerSeat: nextPlayerSeat,
        lastAction: drawnMatchesRequest
          ? `Go Fish! ${playerSeat} drew a ${drawnCard.rank} and gets another turn`
          : `Go Fish! ${playerSeat} drew a card. Turn passes to ${nextPlayerSeat}`,
      };
      
      // Check if game is over
      const gameOverCheck = checkGameOver(newGameState, activePlayers);
      
      if (gameOverCheck.isGameOver) {
        const winnerListString = gameOverCheck.winningSeats.map(seat => seat.toString()).join(', ');
        const winner0 = gameOverCheck.winningSeats[0];
        if (!winner0) {
          return {
            tablePhase: 'table-phase-error',
            gameSpecificState: newGameState,
            gameSpecificStateSummary: 'No winner',
          };
        }
        const winnerScore = newGameState.playerBoardStates[winner0]?.score ?? 0;

        return {
          tablePhase: 'table-phase-game-complete-with-winners',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeats: gameOverCheck.winningSeats,
            resolution: 'game-over-with-winner',
          },
          gameSpecificStateSummary: `${winnerListString} wins with ${winnerScore} sets!`,
        };
      }
      
      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: newGameState,
        gameSpecificStateSummary: newGameState.lastAction || 'Go Fish!',
      };
    }
  }
  
  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Invalid player action`,
  };
};

// Apply host action
const applyGoFishHostAction = async (
  _tableState: GameTable,
  gameState: GoFishHostGameState,
  _hostAction: GoFishHostAction,
): Promise<GameTableActionResult<GoFishHostGameState>> => {
  // Host action is only for initialization
  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: gameState,
    gameSpecificStateSummary: 'Host action processed',
  };
};

// Get next players to act
const getNextToActPlayers = (_gameTable: GameTable, gameState: GoFishPublicGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
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
      continue;
    }
    privateKnowledge.set(playerSeat, playerHandState);
  }

  return privateKnowledge;
};


// Game processor implementation
const goFishProcessorImplementation: IBfgGameProcessor<
  GoFishHostGameState,
  GoFishPlayerAction,
  GoFishHostAction,
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
};

export const GoFishGameProcessor = goFishProcessorImplementation;

// Helper function to get current player
export const getCurrentPlayer = (gameState: GoFishPublicGameState): GameTableSeat => {
  return gameState.currentPlayerSeat;
};

