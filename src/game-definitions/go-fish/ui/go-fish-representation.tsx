import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { Box, Typography, Stack } from "@bfg-engine/ui/bfg-ui";
import { GoFishPlayerHandState, GoFishPublicGameState } from "../go-fish-types";


interface GoFishRepresentationProps {
  myPlayerSeat: GameTableSeat;
  gameState: GoFishPublicGameState;
  myHandState: GoFishPlayerHandState | null;
}

// Component to display a playing card

// Component to display player's hand

// Component to display completed sets
const SetsDisplay = ({ completedSets, score }: { completedSets: string[]; score: number }) => {
  return (
    <Box style={{ marginTop: '12px' }}>
      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
        Completed Sets: {score}
      </Typography>
      {completedSets.length > 0 && (
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {completedSets.map((rank, idx) => (
            <Box
              key={idx}
              style={{
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
  const { myPlayerSeat, gameState, myHandState } = props;
  const myPlayerState = myHandState;

  const winnerListString = gameState.winningSeats.map(seat => seat.toString()).join(', ');

  return (
    <Box style={{ padding: '16px' }}>
      <Stack spacing={3}>
        {/* Game status */}
        <Box>
          <Typography variant="h6">Go Fish</Typography>
          <Typography variant="body2" color="secondary">
            {gameState.isGameOver ? (
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                Game Over! {winnerListString} wins!
              </span>
            ) : (
              <span>
                Current Turn: <strong>{gameState.currentPlayerSeat}</strong>
              </span>
            )}
          </Typography>
          {gameState.lastAction && (
            <Typography variant="body2" style={{ marginTop: '8px', fontStyle: 'italic' }}>
              {gameState.lastAction}
            </Typography>
          )}
        </Box>

        {/* Deck info */}
        <Box>
          <Typography variant="body2">
            Cards remaining in deck: <strong>{gameState.deckCount}</strong>
          </Typography>
        </Box>

        {/* My hand */}
        {myPlayerState && (
          <Box
            style={{
              padding: '16px',
              backgroundColor: '#ecf0f1',
              borderRadius: '8px',
              border: gameState.currentPlayerSeat === myPlayerSeat ? '3px solid #3498db' : '1px solid #bdc3c7',
            }}
          >
            <Typography variant="subtitle1" style={{ marginBottom: '12px', fontWeight: 'bold' }}>
              {myPlayerSeat} (You)
              {gameState.currentPlayerSeat === myPlayerSeat && (
                <span style={{ color: '#3498db', marginLeft: '8px' }}>← Your Turn</span>
              )}
            </Typography>
            {/* <HandDisplay playerState={myPlayerState} isMyHand={true} /> */}
            <SetsDisplay completedSets={gameState.playerBoardStates[myPlayerSeat]?.completedSets ?? []} score={gameState.playerBoardStates[myPlayerSeat]?.score ?? 0} />
          </Box>
        )}

        {/* Other players */}
        <Box>
          <Typography variant="subtitle1" style={{ marginBottom: '12px', fontWeight: 'bold' }}>
            Other Players
          </Typography>
          <Stack spacing={2}>
            {Object.entries(gameState.playerBoardStates)
              .filter(([seat]) => seat !== myPlayerSeat)
              .map(([seat]) => (
                <Box
                  key={seat}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: gameState.currentPlayerSeat === seat ? '3px solid #3498db' : '1px solid #dee2e6',
                  }}
                >
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {seat}
                    {gameState.currentPlayerSeat === seat && (
                      <span style={{ color: '#3498db', marginLeft: '8px' }}>← Current Turn</span>
                    )}
                  </Typography>
                  {/* <HandDisplay playerHandState={playerBoardState.handState} isMyHand={false} /> */}
                  <SetsDisplay completedSets={gameState.playerBoardStates[seat as GameTableSeat]?.completedSets ?? []} score={gameState.playerBoardStates[seat as GameTableSeat]?.score ?? 0} />
                </Box>
              ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

