

// export const RockPaperScissorsObserverComponent = () => {
//   return <div>RockPaperScissorsObserverComponent</div>;
// };

import React from "react";
import type { GameHistoryComponentProps, GameHostComponentProps, GameSpineComponentProps, ObserverComponentProps, PlayerComponentProps } from "../../../../../bfg-engine/src/game-metadata/ui/bfg-game-components"
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../../../../bfg-engine/src/game-metadata/metadata-types/game-state-types"
import { type RockPaperScissorsWatcherGameState } from "../rock-paper-scissors-types"

// export const RockPaperScissorsPlayerComponent = () => {
//   return <div>RockPaperScissorsPlayerComponent</div>;
// };

// export const RockPaperScissorsHostComponent = () => {
//   return <div>RockPaperScissorsHostComponent</div>;
// };


export const RpsObserverComponent = <GSW extends BfgGameStateForWatcher>(
  observerProps: ObserverComponentProps<GSW>
): React.ReactNode => {
  const gameState = observerProps.gameState as unknown as RockPaperScissorsWatcherGameState;
  return (
    <div>ObserverComponent - p1: {gameState.p1Showing}, p2: {gameState.p2Showing}</div>
  )
}

export const RpsPlayerComponent = <GSP extends BfgGameStateForPlayer>(
  _playerProps: PlayerComponentProps<GSP>
): React.ReactNode => {
  return (
    <div>PlayerComponent</div>
  )
}

export const RpsHostComponent = <GSH extends BfgGameStateForHost>(
  _hostProps: GameHostComponentProps<GSH>
): React.ReactNode => {
  return (
    <div>HostComponent</div>
  )
}

export const RpsHistoryComponent = (_historyProps: GameHistoryComponentProps): React.ReactNode => {
  return (
    <div>HistoryComponent</div>
  )
}

export const RpsGameSpineComponent = <GSW extends BfgGameStateForWatcher>(
  _spineProps: GameSpineComponentProps<GSW>
): React.ReactNode => {
  return (
    <div>GameSpineComponent</div>
  )
}