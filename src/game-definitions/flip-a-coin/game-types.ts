import type z from "zod";
import { BfgGameEventOutcomeSchema, BfgGameHostActionOutcomeSchema, BfgGamePlayerActionOutcomeSchema } from "../../../../bfg-engine/src/game-metadata/metadata-types/game-action-types";


export const FlipACoinPlayerActionOutcomeSchema = BfgGamePlayerActionOutcomeSchema;
export type FlipACoinPlayerActionOutcome = z.infer<typeof FlipACoinPlayerActionOutcomeSchema>;

export const FlipACoinHostActionOutcomeSchema = BfgGameHostActionOutcomeSchema;
export type FlipACoinHostActionOutcome = z.infer<typeof FlipACoinHostActionOutcomeSchema>;

export const FlipACoinGameEventOutcomeSchema = BfgGameEventOutcomeSchema.extend({}).describe('FlipACoinGameEventOutcome');
export type FlipACoinGameEventOutcome = z.infer<typeof FlipACoinGameEventOutcomeSchema>;
