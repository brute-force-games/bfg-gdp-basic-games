import { z } from "zod";

// Card ranks for standard playing cards
export const CardRankSchema = z.enum([
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
]);

export type CardRank = z.infer<typeof CardRankSchema>;

// Card suits for standard playing cards
export const CardSuitSchema = z.enum(['hearts', 'diamonds', 'clubs', 'spades']);

export type CardSuit = z.infer<typeof CardSuitSchema>;

// A playing card
export const PlayingCardSchema = z.object({
  rank: CardRankSchema,
  suit: CardSuitSchema,
});

export type PlayingCard = z.infer<typeof PlayingCardSchema>;

// Card ID is a string representation: "rank-suit"
export const createCardId = (card: PlayingCard): string => {
  return `${card.rank}-${card.suit}`;
};

export const parseCardId = (cardId: string): PlayingCard => {
  const [rank, suit] = cardId.split('-');
  return {
    rank: rank as CardRank,
    suit: suit as CardSuit,
  };
};

// Create a standard 52-card deck
export const createStandardDeck = (): PlayingCard[] => {
  const ranks: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  
  const deck: PlayingCard[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if a set of cards forms a complete set (4 of the same rank)
export const isCompleteSet = (cards: PlayingCard[]): boolean => {
  if (cards.length !== 4) return false;
  const rank = cards[0].rank;
  return cards.every(card => card.rank === rank);
};

// Get all cards of a specific rank from a hand
export const getCardsOfRank = (hand: PlayingCard[], rank: CardRank): PlayingCard[] => {
  return hand.filter(card => card.rank === rank);
};

// Remove cards from a hand
export const removeCardsFromHand = (hand: PlayingCard[], cardsToRemove: PlayingCard[]): PlayingCard[] => {
  const cardIdsToRemove = new Set(cardsToRemove.map(createCardId));
  return hand.filter(card => !cardIdsToRemove.has(createCardId(card)));
};

// Count number of complete sets in a collection of cards
export const countCompleteSets = (cards: PlayingCard[]): number => {
  const rankCounts = new Map<CardRank, number>();
  
  for (const card of cards) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
  }
  
  let sets = 0;
  for (const count of rankCounts.values()) {
    sets += Math.floor(count / 4);
  }
  
  return sets;
};

// Get all unique ranks in a hand
export const getUniqueRanksInHand = (hand: PlayingCard[]): CardRank[] => {
  const ranks = new Set(hand.map(card => card.rank));
  return Array.from(ranks);
};

