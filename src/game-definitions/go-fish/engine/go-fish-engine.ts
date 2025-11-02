import { z } from "zod";
import { BfgSupportedGameTitle, GameTableSeatSchema } from "@bfg-engine";
import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
import { GameTable, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { GameTableActionResult } from "@bfg-engine/models/game-table/table-phase";
import { BfgGameSpecificGameStateSchema, BfgGameSpecificTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { IBfgAllPublicKnowledgeGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";
import { 
  CardRankSchema, 
  PlayingCardSchema, 
  PlayingCard, 
  CardRank,
  createStandardDeck,
  shuffleArray,
  getCardsOfRank,
  removeCardsFromHand,
  isCompleteSet,
  createCardId,
} from "./engine-utils";

export const GoFishGameName = 'Go Fish' as BfgSupportedGameTitle;

// Game resolution states
export const GoFishResolutionSchema = z.enum([
  'game-in-progress',
  'game-over-with-winner',
]);

export type GoFishResolution = z.infer<typeof GoFishResolutionSchema>;

// Action type constants
export const GO_FISH_HOST_ACTION_STARTS_GAME = 'game-table-action-host-starts-game' as const;
export const GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS = 'game-table-action-player-ask-for-cards' as const;
export const GO_FISH_PLAYER_ACTION_DRAW_CARD = 'game-table-action-player-draw-card' as const;

// Host action to start the game
export const GoFishStartGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(GO_FISH_HOST_ACTION_STARTS_GAME),
  shuffledDeck: z.array(PlayingCardSchema),
  initialHandSize: z.number(),
});

export type GoFishStartGame = z.infer<typeof GoFishStartGameSchema>;

// Player action to ask another player for cards
export const GoFishPlayerAskForCardsSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS),
  playerSeat: GameTableSeatSchema,
  targetPlayerSeat: GameTableSeatSchema,
  requestedRank: CardRankSchema,
});

export type GoFishPlayerAskForCards = z.infer<typeof GoFishPlayerAskForCardsSchema>;

// Player action to draw a card from the deck
export const GoFishPlayerDrawCardSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(GO_FISH_PLAYER_ACTION_DRAW_CARD),
  playerSeat: GameTableSeatSchema,
});

export type GoFishPlayerDrawCard = z.infer<typeof GoFishPlayerDrawCardSchema>;

// Union of all player actions
export const GoFishPlayerActionSchema = z.discriminatedUnion('playerActionType', [
  GoFishPlayerAskForCardsSchema,
  GoFishPlayerDrawCardSchema,
]);

export type GoFishPlayerAction = z.infer<typeof GoFishPlayerActionSchema>;

// Union of all host actions
export const GoFishHostActionSchema = z.discriminatedUnion('hostActionType', [
  GoFishStartGameSchema,
]);

export type GoFishHostAction = z.infer<typeof GoFishHostActionSchema>;

// Player state in the game
export const PlayerStateSchema = z.object({
  hand: z.array(PlayingCardSchema),
  completedSets: z.array(CardRankSchema),
  score: z.number(),
});

export type PlayerState = z.infer<typeof PlayerStateSchema>;

// Main game state
export const GoFishGameStateSchema = BfgGameSpecificGameStateSchema.extend({
  deck: z.array(PlayingCardSchema),
  playerStates: z.record(GameTableSeatSchema, PlayerStateSchema),
  currentPlayerSeat: GameTableSeatSchema,
  lastAction: z.string().optional(),
  resolution: GoFishResolutionSchema,
  isGameOver: z.boolean(),
  winningSeat: GameTableSeatSchema.optional(),
}).describe('Go Fish');

export type GoFishGameState = z.infer<typeof GoFishGameStateSchema>;

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
): GoFishGameState => {
  if (initialGameTableAction.gameSpecificAction.hostActionType !== GO_FISH_HOST_ACTION_STARTS_GAME) {
    throw new Error("Initial game action must be a host starts game");
  }

  const { shuffledDeck, initialHandSize } = initialGameTableAction.gameSpecificAction;
  const activePlayers = getActivePlayerSeatsForGameTable(gameTable);
  
  // Deal cards to players
  const playerStates: Record<GameTableSeat, PlayerState> = {} as any;
  let deckIndex = 0;
  
  for (const seat of activePlayers) {
    const hand: PlayingCard[] = [];
    for (let i = 0; i < initialHandSize; i++) {
      if (deckIndex < shuffledDeck.length) {
        hand.push(shuffledDeck[deckIndex]);
        deckIndex++;
      }
    }
    
    playerStates[seat] = {
      hand,
      completedSets: [],
      score: 0,
    };
  }
  
  // Remaining deck after dealing
  const remainingDeck = shuffledDeck.slice(deckIndex);
  
  const initialGameState: GoFishGameState = {
    deck: remainingDeck,
    playerStates,
    currentPlayerSeat: activePlayers[0],
    lastAction: 'Game started',
    resolution: 'game-in-progress',
    isGameOver: false,
  };

  return initialGameState;
};

// Helper to check for complete sets in a hand and remove them
const checkAndRemoveCompleteSets = (playerState: PlayerState): PlayerState => {
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
    completedSets: [...playerState.completedSets, ...completedSets],
    score: playerState.score + completedSets.length,
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
const checkGameOver = (gameState: GoFishGameState, activePlayers: GameTableSeat[]): {
  isGameOver: boolean;
  winningSeat?: GameTableSeat;
} => {
  // Game is over if deck is empty and a player has no cards
  const deckEmpty = gameState.deck.length === 0;
  
  if (!deckEmpty) {
    return { isGameOver: false };
  }
  
  // Check if any player has no cards
  const allPlayersOutOfCards = activePlayers.every(
    seat => gameState.playerStates[seat].hand.length === 0
  );
  
  if (allPlayersOutOfCards) {
    // Find winner with most sets
    let maxScore = -1;
    let winningSeat: GameTableSeat | undefined;
    
    for (const seat of activePlayers) {
      const score = gameState.playerStates[seat].score;
      if (score > maxScore) {
        maxScore = score;
        winningSeat = seat;
      }
    }
    
    return { isGameOver: true, winningSeat };
  }
  
  return { isGameOver: false };
};

// Apply player action: ask for cards
const applyGoFishPlayerAction = async (
  tableState: GameTable,
  gameState: GoFishGameState,
  playerAction: GoFishPlayerAction,
): Promise<GameTableActionResult<GoFishGameState>> => {
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
    const playerHand = gameState.playerStates[playerSeat].hand;
    const hasRequestedRank = playerHand.some(card => card.rank === requestedRank);
    
    if (!hasRequestedRank) {
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: `${playerSeat} doesn't have any ${requestedRank}s to ask for`,
      };
    }
    
    // Get target player's cards of requested rank
    const targetPlayerState = gameState.playerStates[targetPlayerSeat];
    const matchingCards = getCardsOfRank(targetPlayerState.hand, requestedRank);
    
    if (matchingCards.length > 0) {
      // Target has cards - transfer them
      const newTargetHand = removeCardsFromHand(targetPlayerState.hand, matchingCards);
      const newPlayerHand = [...playerHand, ...matchingCards];
      
      let updatedPlayerState = {
        ...gameState.playerStates[playerSeat],
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      updatedPlayerState = checkAndRemoveCompleteSets(updatedPlayerState);
      
      const newGameState: GoFishGameState = {
        ...gameState,
        playerStates: {
          ...gameState.playerStates,
          [playerSeat]: updatedPlayerState,
          [targetPlayerSeat]: {
            ...targetPlayerState,
            hand: newTargetHand,
          },
        },
        lastAction: `${playerSeat} got ${matchingCards.length} ${requestedRank}(s) from ${targetPlayerSeat}`,
        // Player gets another turn
      };
      
      // Check if game is over
      const gameOverCheck = checkGameOver(newGameState, activePlayers);
      
      if (gameOverCheck.isGameOver) {
        return {
          tablePhase: 'table-phase-game-complete-with-winners',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeat: gameOverCheck.winningSeat,
            resolution: 'game-over-with-winner',
          },
          gameSpecificStateSummary: `${gameOverCheck.winningSeat} wins with ${newGameState.playerStates[gameOverCheck.winningSeat!].score} sets!`,
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
        ...gameState.playerStates[playerSeat],
        hand: newPlayerHand,
      };
      
      // Check for complete sets
      updatedPlayerState = checkAndRemoveCompleteSets(updatedPlayerState);
      
      // If drawn card matches requested rank, player gets another turn
      const drawnMatchesRequest = drawnCard.rank === requestedRank;
      const nextPlayerSeat = drawnMatchesRequest 
        ? playerSeat 
        : getNextPlayerSeat(playerSeat, activePlayers);
      
      const newGameState: GoFishGameState = {
        ...gameState,
        deck: newDeck,
        playerStates: {
          ...gameState.playerStates,
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
        return {
          tablePhase: 'table-phase-game-complete-with-winners',
          gameSpecificState: {
            ...newGameState,
            isGameOver: true,
            winningSeat: gameOverCheck.winningSeat,
            resolution: 'game-over-with-winner',
          },
          gameSpecificStateSummary: `${gameOverCheck.winningSeat} wins with ${newGameState.playerStates[gameOverCheck.winningSeat!].score} sets!`,
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
  gameState: GoFishGameState,
  _hostAction: GoFishHostAction,
): Promise<GameTableActionResult<GoFishGameState>> => {
  // Host action is only for initialization
  return {
    tablePhase: 'table-phase-game-in-progress',
    gameSpecificState: gameState,
    gameSpecificStateSummary: 'Host action processed',
  };
};

// Get next players to act
const getNextToActPlayers = (gameTable: GameTable, gameState: GoFishGameState): GameTableSeat[] => {
  if (gameState.isGameOver) {
    return [];
  }
  
  return [gameState.currentPlayerSeat];
};

// Get player details for display
const getPlayerDetailsLine = (gameState: GoFishGameState, playerSeat: GameTableSeat): React.ReactNode => {
  const playerState = gameState.playerStates[playerSeat];
  if (!playerState) {
    return `${playerSeat}: Not in game`;
  }
  
  return `${playerSeat}: ${playerState.hand.length} cards, ${playerState.score} sets`;
};

// Game processor implementation
const goFishProcessorImplementation: IBfgAllPublicKnowledgeGameProcessor<
  GoFishGameState,
  GoFishPlayerAction,
  GoFishHostAction
> = {
  gameTitle: GoFishGameName,

  createGameSpecificInitialAction: createInitialGoFishGameAction,
  createGameSpecificInitialState: createInitialGameState,
  applyPlayerAction: applyGoFishPlayerAction,
  applyHostAction: applyGoFishHostAction,

  getNextToActPlayers: getNextToActPlayers,
  getPlayerDetailsLine: getPlayerDetailsLine,
};

export const GoFishGameProcessor = goFishProcessorImplementation;

// Helper function to get current player
export const getCurrentPlayer = (gameState: GoFishGameState): GameTableSeat => {
  return gameState.currentPlayerSeat;
};

