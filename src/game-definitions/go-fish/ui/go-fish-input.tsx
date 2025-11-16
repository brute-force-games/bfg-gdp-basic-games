import { useState, useEffect } from 'react';
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { CardRank } from "@bfg-engine/game-stock/std-card-games/types";
import { Box, Typography, Button, Stack } from "@bfg-engine/ui/bfg-ui";
import { GoFishPlayerAction, GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS, GoFishPublicGameState, GoFishPlayerHandState } from '../go-fish-types';


interface GoFishInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: GoFishPublicGameState;
  myPlayerState: GoFishPlayerHandState | null;
  preSelectedRank: CardRank | null;
  onGameAction: (gameState: GoFishPublicGameState, action: GoFishPlayerAction) => void;
  onRankChange: (rank: CardRank | null) => void;
}

export const GoFishInput = (props: GoFishInputProps) => {
  const { myPlayerSeat, gameState, onGameAction, preSelectedRank, onRankChange } = props;
  const [selectedRank, setSelectedRank] = useState<CardRank | null>(null);
  const [selectedTargetPlayer, setSelectedTargetPlayer] = useState<GameTableSeat | null>(null);

  const isMyTurn = gameState.currentPlayerSeat === myPlayerSeat;
  const myPlayerBoardState = gameState.playerBoardStates[myPlayerSeat];
  // Collect all completed sets from all players - once a rank is completed by any player, it's no longer available
  const allCompletedSets = Object.values(gameState.playerBoardStates)
    .flatMap(playerState => playerState.completedSets);

  // Auto-select rank when preSelectedRank changes
  useEffect(() => {
    console.log('GoFishInput useEffect - preSelectedRank:', preSelectedRank);
    if (preSelectedRank && preSelectedRank !== selectedRank) {
      const isCompleted = allCompletedSets.includes(preSelectedRank);
      if (!isCompleted) {
        setSelectedRank(preSelectedRank as CardRank);
      }
    }
  }, [preSelectedRank, selectedRank, allCompletedSets]);

  // Deselect rank if it gets completed
  useEffect(() => {
    if (selectedRank && allCompletedSets.includes(selectedRank)) {
      setSelectedRank(null);
      onRankChange?.(null);
    }
  }, [allCompletedSets, selectedRank, onRankChange]);

  // Notify parent when rank changes
  const handleRankSelect = (rank: CardRank) => {
    const isCompleted = allCompletedSets.includes(rank);
    if (!isCompleted) {
      setSelectedRank(rank);
      onRankChange?.(rank);
    }
  };

  console.log('GoFishInput render - selectedRank:', selectedRank, 'preSelectedRank:', preSelectedRank, 'isMyTurn:', isMyTurn);

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

  // Get all possible card ranks (not limited to player's hand)
  const allPossibleRanks: CardRank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  // Get other players
  const otherPlayers = Object.keys(gameState.playerBoardStates)
    .filter(seat => seat !== myPlayerSeat) as GameTableSeat[];

  // If only one opponent, auto-select them
  const hasOnlyOneOpponent = otherPlayers.length === 1;
  const autoSelectedTargetPlayer = hasOnlyOneOpponent ? otherPlayers[0] : null;

  // Use auto-selected player if there's only one opponent, otherwise use manual selection
  const effectiveTargetPlayer = autoSelectedTargetPlayer || selectedTargetPlayer;

  const handleAskForCards = () => {
    if (!selectedRank || !effectiveTargetPlayer) {
      return;
    }

    const action: GoFishPlayerAction = {
      source: 'player',
      playerActionType: GO_FISH_PLAYER_ACTION_ASK_FOR_CARDS,
      playerSeat: myPlayerSeat,
      targetPlayerSeat: effectiveTargetPlayer,
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

        {/* Select player and rank side by side */}
        <Box style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Select target player - LEFT */}
          <Box style={{ flex: 1 }}>
            {hasOnlyOneOpponent ? (
              <>
                <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  1. Player to ask:
                </Typography>
                <Box
                  style={{
                    padding: '12px',
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #2196f3',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body1" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {autoSelectedTargetPlayer}
                  </Typography>
                  <Typography variant="caption" style={{ color: '#666' }}>
                    ({gameState.playerBoardStates[autoSelectedTargetPlayer!]?.handSize ?? 0} cards, {gameState.playerBoardStates[autoSelectedTargetPlayer!]?.score ?? 0} sets)
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  1. Select a player to ask:
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
              </>
            )}
          </Box>

          {/* Select rank - RIGHT */}
          <Box style={{ flex: 1 }}>
            <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {hasOnlyOneOpponent ? '2. Select a rank to ask for:' : '2. Select a rank to ask for:'}
            </Typography>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allPossibleRanks.map(rank => {
                const isCompleted = allCompletedSets.includes(rank);
                return (
                  <Button
                    key={rank}
                    variant={selectedRank === rank ? 'contained' : 'outlined'}
                    onClick={() => !isCompleted && handleRankSelect(rank)}
                    disabled={isCompleted}
                    style={{
                        minWidth: '60px',
                        padding: '12px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        opacity: isCompleted ? 0.5 : 1,
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}
                    title={isCompleted ? `Set of ${rank}s already completed` : `Ask for ${rank}s`}
                  >
                    {rank}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Submit button */}
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAskForCards}
            disabled={!selectedRank || !effectiveTargetPlayer}
            fullWidth
            style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {selectedRank && effectiveTargetPlayer
              ? `Ask ${effectiveTargetPlayer} for ${selectedRank}s`
              : 'Select rank and player'}
          </Button>
        </Box>

        {/* Help text */}
        <Box style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
          <Typography variant="caption" style={{ display: 'block', marginBottom: '4px' }}>
            <strong>How to play:</strong>
          </Typography>
          <Typography variant="caption" style={{ display: 'block' }}>
            • Ask another player for cards of any rank you want
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
