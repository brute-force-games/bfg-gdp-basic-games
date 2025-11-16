import { GameSpineComponentProps } from "@bfg-engine/game-metadata/ui/bfg-game-components"
import { FlipACoinGameName, FlipACoinGameStateSchema } from "../../engine/flip-a-coin-engine"
import { useGameMetadata } from "@bfg-engine";
import { BfgGameSpine } from "@bfg-engine/ui/bfg-ui";


export const FlipACoinGameSpineComponent = (props: GameSpineComponentProps<typeof FlipACoinGameStateSchema>) => {
  const { gameTable, allPlayerProfiles, gameState, orientation } = props;

  const gameMetadata = useGameMetadata(FlipACoinGameName);

  console.log('FlipACoinGameSpineComponent', gameTable, allPlayerProfiles, gameState);

  const nextToActPlayers = gameMetadata.engine.getNextToActPlayers(gameTable, gameState);
  const playerDetailsLineFn = gameMetadata.engine.getPlayerDetailsLine;

  return (
    <BfgGameSpine
      gameTitle={FlipACoinGameName}
      gameSourceUrl="https://github.com/brute-force-games/bfg-gdp-basic-games/tree/main/src/game-definitions/flip-a-coin"
      orientation={orientation}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      nextToActPlayers={nextToActPlayers}
      gameState={gameState}
      playerDetailsLineFn={playerDetailsLineFn}
    />
  );
}
