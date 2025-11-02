import { GoFishGameState, PlayerState } from "../engine/go-fish-engine";
import { PlayingCard } from "../engine/engine-utils";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { Box, Typography, Stack } from "@bfg-engine/ui/bfg-ui";

interface GoFishRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: GoFishGameState;
}

// Component to display a playing card
const CardDisplay = ({ card }: { card: PlayingCard }) => {
  const suitSymbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  
  const suitColors: Record<string, string> = {
    hearts: '#e74c3c',
    diamonds: '#e74c3c',
    clubs: '#2c3e50',
    spades: '#2c3e50',
  };
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '70px',
        border: '2px solid #34495e',
        borderRadius: '6px',
        backgroundColor: 'white',
        margin: '4px',
        padding: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: suitColors[card.suit],
          lineHeight: 1,
        }}
      >
        {card.rank}
      </Typography>
      <Typography
        sx={{
          fontSize: '20px',
          color: suitColors[card.suit],
          lineHeight: 1,
        }}
      >
        {suitSymbols[card.suit]}
      </Typography>
    </Box>
  );
};

// Component to display player's hand
const HandDisplay = ({ playerState, isMyHand }: { playerState: PlayerState; isMyHand: boolean }) => {
  return (
    <Box>
      <Typography variant="body2" sx={{ marginBottom: '8px' }}>
        {isMyHand ? 'Your Hand' : 'Hand'}: {playerState.hand.length} cards
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {isMyHand ? (
          playerState.hand.map((card, idx) => (
            <CardDisplay key={`${card.rank}-${card.suit}-${idx}`} card={card} />
          ))
        ) : (
          // Show card backs for other players
          playerState.hand.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: '50px',
                height: '70px',
                border: '2px solid #34495e',
                borderRadius: '6px',
                backgroundColor: '#3498db',
                margin: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '24px' }}>?</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

// Component to display completed sets
const SetsDisplay = ({ completedSets, score }: { completedSets: string[]; score: number }) => {
  return (
    <Box sx={{ marginTop: '12px' }}>
      <Typography variant="body2" fontWeight="bold">
        Completed Sets: {score}
      </Typography>
      {completedSets.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {completedSets.map((rank, idx) => (
            <Box
              key={idx}
              sx={{
                padding: '6px 12px',
                backgroundColor: '#2ecc71',
                color: 'white',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              {rank} ×4
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const GoFishRepresentation = (props: GoFishRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;
  const myPlayerState = gameState.playerStates[myPlayerSeat];

  return (
    <Box sx={{ padding: '16px' }}>
      <Stack spacing={3}>
        {/* Game status */}
        <Box>
          <Typography variant="h6">Go Fish</Typography>
          <Typography variant="body2" color="secondary">
            {gameState.isGameOver ? (
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                Game Over! {gameState.winningSeat} wins!
              </span>
            ) : (
              <span>
                Current Turn: <strong>{gameState.currentPlayerSeat}</strong>
              </span>
            )}
          </Typography>
          {gameState.lastAction && (
            <Typography variant="body2" sx={{ marginTop: '8px', fontStyle: 'italic' }}>
              {gameState.lastAction}
            </Typography>
          )}
        </Box>

        {/* Deck info */}
        <Box>
          <Typography variant="body2">
            Cards remaining in deck: <strong>{gameState.deck.length}</strong>
          </Typography>
        </Box>

        {/* My hand */}
        {myPlayerState && (
          <Box
            sx={{
              padding: '16px',
              backgroundColor: '#ecf0f1',
              borderRadius: '8px',
              border: gameState.currentPlayerSeat === myPlayerSeat ? '3px solid #3498db' : '1px solid #bdc3c7',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: '12px' }}>
              {myPlayerSeat} (You)
              {gameState.currentPlayerSeat === myPlayerSeat && (
                <span style={{ color: '#3498db', marginLeft: '8px' }}>← Your Turn</span>
              )}
            </Typography>
            <HandDisplay playerState={myPlayerState} isMyHand={true} />
            <SetsDisplay completedSets={myPlayerState.completedSets} score={myPlayerState.score} />
          </Box>
        )}

        {/* Other players */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: '12px' }}>
            Other Players
          </Typography>
          <Stack spacing={2}>
            {Object.entries(gameState.playerStates)
              .filter(([seat]) => seat !== myPlayerSeat)
              .map(([seat, playerState]) => (
                <Box
                  key={seat}
                  sx={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: gameState.currentPlayerSeat === seat ? '3px solid #3498db' : '1px solid #dee2e6',
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {seat}
                    {gameState.currentPlayerSeat === seat && (
                      <span style={{ color: '#3498db', marginLeft: '8px' }}>← Current Turn</span>
                    )}
                  </Typography>
                  <HandDisplay playerState={playerState} isMyHand={false} />
                  <SetsDisplay completedSets={playerState.completedSets} score={playerState.score} />
                </Box>
              ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

