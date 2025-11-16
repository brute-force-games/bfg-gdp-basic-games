import { PlayingCard, CardRank } from "@bfg-engine/game-stock/std-card-games/types";
import { createCardId } from "@bfg-engine/game-stock/std-card-games/types";


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
