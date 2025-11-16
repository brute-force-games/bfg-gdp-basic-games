

// export const RockPaperScissorsObserverComponent = () => {
//   return <div>RockPaperScissorsObserverComponent</div>;
// };

import type { GameHistoryComponentProps, GameHostComponentProps, GameSpineComponentProps, ObserverComponentProps, PlayerComponentProps } from "../../../../../bfg-engine/src/game-metadata/ui/bfg-game-components"
import { type RockPaperScissorsHostAction, type RockPaperScissorsHostGameState, type RockPaperScissorsPlayerAction, type RockPaperScissorsPlayerGameState, type RockPaperScissorsWatcherGameState } from "../rock-paper-scissors-types"

// export const RockPaperScissorsPlayerComponent = () => {
//   return <div>RockPaperScissorsPlayerComponent</div>;
// };

// export const RockPaperScissorsHostComponent = () => {
//   return <div>RockPaperScissorsHostComponent</div>;
// };


export const RpsObserverComponent = (
  _observerProps: ObserverComponentProps<RockPaperScissorsWatcherGameState>
) => {
  return (
    <div>ObserverComponent</div>
  )
}

export const RpsPlayerComponent = (
  _playerProps: PlayerComponentProps<RockPaperScissorsPlayerGameState, RockPaperScissorsPlayerAction>
) => {
  return (
    <div>PlayerComponent</div>
  )
}

export const RpsHostComponent = (
  _hostProps: GameHostComponentProps<RockPaperScissorsHostGameState, RockPaperScissorsHostAction>
) => {
  return (
    <div>HostComponent</div>
  )
}

export const RpsHistoryComponent = (_historyProps: GameHistoryComponentProps) => {
  return (
    <div>HistoryComponent</div>
  )
}

export const RpsGameSpineComponent = (
  _spineProps: GameSpineComponentProps<RockPaperScissorsWatcherGameState>
) => {
  return (
    <div>GameSpineComponent</div>
  )
}