import { z } from "zod";


export const ROCK_PAPER_SCISSORS_HOST_ACTION_START_GAME = 'game-table-action-host-start-game' as const;
export const ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_ROUND_WINNER = 'host-action-call-round-winner' as const;
export const ROCK_PAPER_SCISSORS_HOST_ACTION_CALL_GAME_WINNER = 'host-action-call-game-winner' as const;

export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_SET_HAND = 'player-action-set-hand' as const;
export const ROCK_PAPER_SCISSORS_PLAYER_ACTION_CONCEDE = 'player-action-concede' as const;


export const RockPaperScissorsPlayerChoiceSchema = z.enum([
  'rock',
  'paper',
  'scissors',
]);
export type RockPaperScissorsPlayerChoice = z.infer<typeof RockPaperScissorsPlayerChoiceSchema>;


export const RockPaperScissorsPlayerShowingSchema = z.union([
  RockPaperScissorsPlayerChoiceSchema,
  z.enum(['hidden']),
]).describe('RockPaperScissorsPlayerShowing');
export type RockPaperScissorsPlayerShowing = z.infer<typeof RockPaperScissorsPlayerShowingSchema>;
