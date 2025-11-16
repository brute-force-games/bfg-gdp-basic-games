import { useState } from 'react';
import { PlayerComponentProps } from '@bfg-engine/models/game-engine/bfg-game-engine-types';
import { GoFishRepresentation } from '../go-fish-representation';
import { GoFishInput } from '../go-fish-input';
import { Box, Stack, Typography } from '@bfg-engine/ui/bfg-ui';
import { GoFishPublicGameState, GoFishPlayerHandState, GoFishPlayerAction } from '../../go-fish-types';
import { CardRank } from '@bfg-engine/game-stock/std-card-games/types';


export const GoFishPlayerComponent = (props: PlayerComponentProps<GoFishPublicGameState, GoFishPlayerAction, GoFishPlayerHandState>) => {
  const { gameState, myPrivatePlayerKnowledge, currentPlayerSeat, onPlayerAction } = props;
  const [selectedRank, setSelectedRank] = useState<CardRank | null>(null);

  console.log('GoFishPlayerComponent gameState:', gameState, 'currentPlayerSeat:', currentPlayerSeat);

  if (!gameState) {
    return (
      <Box style={{ padding: '16px' }}>
        <Typography>Loading game state...</Typography>
      </Box>
    );
  }

  const handleCardClick = (rank: string) => {
    console.log('Card clicked:', rank);
    setSelectedRank(rank as CardRank);
  };

  const handleRankSelected = (rank: CardRank | null) => {
    console.log('Rank selected from input:', rank);
    setSelectedRank(rank);
  };

  console.log('GoFishPlayerComponent selectedRank:', selectedRank);

  return (
    <Box>
      <Stack spacing={3}>
        <GoFishRepresentation
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          myHandState={myPrivatePlayerKnowledge}
          onCardClick={handleCardClick}
          selectedRank={selectedRank}
        />
        <GoFishInput
          myPlayerSeat={currentPlayerSeat}
          gameState={gameState}
          myPlayerState={myPrivatePlayerKnowledge}
          preSelectedRank={selectedRank}
          onRankChange={handleRankSelected}
          onGameAction={(_, action) => {
            onPlayerAction(action);
            // Reset the selected rank after action is sent
            setSelectedRank(null);
          }}
        />
      </Stack>
    </Box>
  );
};

