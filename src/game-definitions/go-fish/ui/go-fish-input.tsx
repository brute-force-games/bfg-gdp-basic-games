import { useState } from 'react';
import { CardRank } from "../engine/engine-utils";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { Box, Typography, Button, Stack } from "@bfg-engine/ui/bfg-ui";
import { GoFishPlayerAction, GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS, GoFishPublicGameState, GoFishPlayerHandState } from '../go-fish-types';


interface GoFishInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: GoFishPublicGameState;
  myPlayerState: GoFishPlayerHandState | null;
  onGameAction: (gameState: GoFishPublicGameState, action: GoFishPlayerAction) => void;
}

export const GoFishInput = (props: GoFishInputProps) => {
  const { myPlayerSeat, gameState, myPlayerState, onGameAction } = props;
  const [selectedRank, setSelectedRank] = useState<CardRank | null>(null);
  const [selectedTargetPlayer, setSelectedTargetPlayer] = useState<GameTableSeat | null>(null);

  const isMyTurn = gameState.currentPlayerSeat === myPlayerSeat;
  const myPlayerBoardState = gameState.playerBoardStates[myPlayerSeat];
  const myPlayerHandState = myPlayerState;

  if (!myPlayerBoardState) {
    return (
      <Box style={{ padding: '16px' }}>
        <Typography>You are not in this game</Typography>
      </Box>
    );
  }

  if (gameState.isGameOver) {
    const winnerListString = gameState.winningSeats.map(seat => seat.toString()).join(', ');
    return (
      <Box style={{ padding: '16px' }}>
        <Typography variant="h6" style={{ color: '#e74c3c' }}>
          Game Over!
        </Typography>
        <Typography>
          Winners: <strong>{winnerListString}</strong>
        </Typography>
      </Box>
    );
  }

  if (!isMyTurn) {
    return (
      <Box style={{ padding: '16px' }}>
        <Typography variant="body1" color="secondary">
          Waiting for {gameState.currentPlayerSeat}'s turn...
        </Typography>
      </Box>
    );
  }

  // Get unique ranks in player's hand
  console.log('🎮 myPlayerHandState:', myPlayerHandState);
  const ranksInHand = Array.from(new Set(myPlayerHandState?.hand.map(card => card.rank) ?? []));
  
  // Get other players
  const otherPlayers = Object.keys(gameState.playerBoardStates)
    .filter(seat => seat !== myPlayerSeat) as GameTableSeat[];

  const handleAskForCards = () => {
    if (!selectedRank || !selectedTargetPlayer) {
      return;
    }

    const action: GoFishPlayerAction = {
      source: 'player',
      playerActionType: GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS,
      playerSeat: myPlayerSeat,
      targetPlayerSeat: selectedTargetPlayer,
      requestedRank: selectedRank,
    };

    onGameAction(gameState, action);
    
    // Reset selections
    setSelectedRank(null);
    setSelectedTargetPlayer(null);
  };

  return (
      <Box style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <Stack spacing={3}>
        <Typography variant="h6" style={{ color: '#2c3e50' }}>
          Your Turn - Ask for Cards
        </Typography>

        {/* Select rank */}
        <Box>
          <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            1. Select a rank from your hand:
          </Typography>
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ranksInHand.map(rank => (
              <Button
                key={rank}
                variant={selectedRank === rank ? 'contained' : 'outlined'}
                onClick={() => setSelectedRank(rank)}
                style={{
                  minWidth: '60px',
                  padding: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {rank}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Select target player */}
        <Box>
          <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            2. Select a player to ask:
          </Typography>
          <Stack spacing={1}>
            {otherPlayers.map(seat => {
              const playerBoardState = gameState.playerBoardStates[seat];
              return (
                <Button
                  key={seat}
                  variant={selectedTargetPlayer === seat ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTargetPlayer(seat)}
                  style={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                  }}
                >
                  <span>{seat}</span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    ({playerBoardState?.handSize ?? 0} cards, {playerBoardState?.score ?? 0} sets)
                  </span>
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Submit button */}
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAskForCards}
            disabled={!selectedRank || !selectedTargetPlayer}
            fullWidth
            style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {selectedRank && selectedTargetPlayer
              ? `Ask ${selectedTargetPlayer} for ${selectedRank}s`
              : 'Select rank and player'}
          </Button>
        </Box>

        {/* Help text */}
        <Box style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '4px' }}>
            <strong>How to play:</strong>
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • Ask another player for cards of a rank you have in your hand
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • If they have it, you get all their cards of that rank and go again
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • If they don't have it, you draw from the deck (Go Fish!)
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • Collect 4 cards of the same rank to complete a set
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • Player with the most sets when the deck runs out wins!
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
