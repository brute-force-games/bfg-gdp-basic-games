import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { FlipACoinPlayerAction, FlipACoinGameState, FlipACoinHostAction } from "../engine/flip-a-coin-engine";



interface FlipACoinRepresentationProps {
  myPlayerSeat: GameTableSeat | null;
  gameState: FlipACoinGameState;
  mostRecentAction: FlipACoinPlayerAction | FlipACoinHostAction | null;
}

export const FlipACoinRepresentation = (props: FlipACoinRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  console.log('FlipACoinRepresentation', props);

  if (gameState.isGameOver) {
    return (
      <div>
        <div>Game is complete - {gameState.outcomeSummary}</div>
      </div>
    );
  }

  const preferredOutcome = myPlayerSeat === null ?
    "Just watching" :
    gameState.playerFlipResultPreferences?.[myPlayerSeat];

  const getOutcomeResult = () => {
    if (gameState.flipResult === undefined) {
      return 'oo';
    }

    if (myPlayerSeat === null) {
      return ':|';
    }

    switch (gameState.playerFlipResultPreferences?.[myPlayerSeat]) {
      case 'heads':
        return gameState.flipResult === 'heads' ? ':D' : ':(';
      case 'tails':
        return gameState.flipResult === 'tails' ? ':D' : ':(';
      case undefined:
      case 'no-preference':
      default:
        return ':|';
    }
  }

  const coinType = gameState.chosenCoin;
  const outcomeResult = getOutcomeResult();

  if (gameState.isFlipped) {
    return (
      <>
        <div>
          A {coinType} was flipped and got {gameState.flipResult}
        </div>
        <div>My preferred outcome: {preferredOutcome}</div>
        <div>
          {outcomeResult}
        </div>
      </>
    );
  }

  return (
    <>
      <div>Flipping a {coinType}</div>
      <div>My preferred outcome: {preferredOutcome}</div>
    </>
  );
}
