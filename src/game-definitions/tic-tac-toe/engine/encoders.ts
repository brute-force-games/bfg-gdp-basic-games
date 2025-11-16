import { createJsonZodObjectDataEncoder } from "@bfg-engine/game-metadata/encoders"
import { TicTacToeGameStateSchema, TicTacToeHostActionSchema, TicTacToePlayerActionSchema } from "./tic-tac-toe-engine";


export const TicTacToeGameSpecificStateEncoder = createJsonZodObjectDataEncoder(TicTacToeGameStateSchema);
export const TicTacToePlayerActionEncoder = createJsonZodObjectDataEncoder(TicTacToePlayerActionSchema);
export const TicTacToeHostActionEncoder = createJsonZodObjectDataEncoder(TicTacToeHostActionSchema);
