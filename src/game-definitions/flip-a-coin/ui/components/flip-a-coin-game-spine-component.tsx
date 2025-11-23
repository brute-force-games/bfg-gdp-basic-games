import { GameSpineComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components"
import { FlipACoinGameName } from "../../engine/flip-a-coin-engine"
import { useGameMetadata } from "@bfg-engine";
import { BfgGameSpine } from "@bfg-engine/ui/bfg-ui";
import type { BfgGameStateForWatcher } from "@bfg-engine/game-metadata/metadata-types/game-state-types";
import type { FlipACoinGameState } from "../../game-types";


export const FlipACoinGameSpineComponent = (
  props: GameSpineComponentProps<BfgGameStateForWatcher>,
) => {
  const { gameRoom, allPlayerProfiles, gameState, orientation } = props;

  const gameMetadata = useGameMetadata(FlipACoinGameName);

  console.log('FlipACoinGameSpineComponent', gameRoom, allPlayerProfiles, gameState);

  const typedGameState = gameState as unknown as FlipACoinGameState;
  const nextToActPlayers = gameMetadata.gameProcessor.getNextToActPlayers(gameRoom, typedGameState);
  const playerDetailsLineFn = (gr: typeof gameRoom, gs: BfgGameStateForWatcher, playerSeat: typeof gameRoom.players[0]['role']) => {
    return gameMetadata.gameProcessor.getPlayerDetailsLine(gr, gs as unknown as FlipACoinGameState, playerSeat);
  };

  return (
    <BfgGameSpine
      gameTitle={FlipACoinGameName}
      gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/flip-a-coin"
      orientation={orientation}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState as BfgGameStateForWatcher}
      playerDetailsLineFn={playerDetailsLineFn}
    />
  );
}
