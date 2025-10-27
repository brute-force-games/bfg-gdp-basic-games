import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders"
import { TicTacToeGameStateSchema, TicTacToeHostActionSchema, TicTacToePlayerActionSchema } from "./tic-tac-toe-engine";


export const TicTacToeGameSpecificStateEncoder = createJsonZodObjectDataEncoder(TicTacToeGameStateSchema);
export const TicTacToePlayerActionEncoder = createJsonZodObjectDataEncoder(TicTacToePlayerActionSchema);
export const TicTacToeHostActionEncoder = createJsonZodObjectDataEncoder(TicTacToeHostActionSchema);
