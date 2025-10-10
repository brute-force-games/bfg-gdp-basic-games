# BFG GDP Basic Games

A collection of classic game definitions built using the BFG Engine.

## Games Included

### Pong
Classic paddle game where you bounce a ball between two paddles.
- **Controls**: W/S for Player 1, Arrow Keys for Player 2
- **Objective**: Keep the ball in play and score points

### Snake
Classic snake game where you control a growing snake.
- **Controls**: Arrow Keys to move
- **Objective**: Eat food to grow while avoiding hitting yourself

### Breakout
Classic brick-breaking game.
- **Controls**: Arrow Keys to move paddle, Space to launch ball
- **Objective**: Break all bricks with the ball

### Space Invaders
Classic alien shooting game.
- **Controls**: Arrow Keys to move, Space to shoot
- **Objective**: Shoot down all alien invaders

## Usage

```typescript
import { PongGameDefinition, GameFactory } from '@brute-force-games/bfg-gdp-basic-games';
import { GameCanvas } from '@brute-force-games/bfg-engine';

// Create a game instance
const gameInstance = GameFactory.createGame(PongGameDefinition, canvas);

// Start the game
gameInstance.engine.setScene('game');
gameInstance.engine.start();
```

## Game Definition Structure

Each game is defined using a `GameDefinition` object that includes:

- **Basic Info**: Name, description, version, author
- **Configuration**: Game settings like resolution, FPS, theme
- **Scenes**: Game scenes with objects and update logic
- **Controls**: Keyboard controls and their actions
- **Assets**: Optional game assets (images, sounds, etc.)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check
```

## Adding New Games

1. Create a new file in `src/games/`
2. Define your game using the `GameDefinition` interface
3. Export it from `src/index.ts`
4. Use the `GameFactory` to create instances

Example:

```typescript
export const MyGameDefinition: GameDefinition = {
  name: 'My Game',
  description: 'A fun game',
  version: '1.0.0',
  author: 'Your Name',
  config: GameFactory.createConfig({
    width: 800,
    height: 600,
    fps: 60
  }),
  scenes: [
    {
      name: 'main',
      objects: [
        // Your game objects
      ],
      onUpdate: (deltaTime, engine) => {
        // Your game logic
      }
    }
  ],
  controls: [
    // Your controls
  ]
};
```

## License

AGPL-3.0