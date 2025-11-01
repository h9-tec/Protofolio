import { useEffect, useState, useCallback, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: () => void;
  onScore: (score: number) => void;
}

export default function SnakeGame({ onExit, onScore }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const gridSize = 20;
  const cellSize = 15;

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    return snakeBody.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore((prev) => {
          const newScore = prev + 10;
          onScore(newScore);
          return newScore;
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, checkCollision, generateFood, onScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, onExit]);

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4 my-4">
      <div className="flex justify-between w-full max-w-md text-[#00ff00]">
        <div>Score: {score}</div>
        <div>Press ESC to exit</div>
      </div>
      
      <div
        className="border-2 border-[#00ff00] bg-black relative"
        style={{
          width: gridSize * cellSize,
          height: gridSize * cellSize,
        }}
      >
        {/* Food */}
        <div
          className="absolute bg-red-500 animate-pulse"
          style={{
            width: cellSize - 2,
            height: cellSize - 2,
            left: food.x * cellSize + 1,
            top: food.y * cellSize + 1,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-[#00ff00]"
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              opacity: index === 0 ? 1 : 0.7,
            }}
          />
        ))}
      </div>

      {gameOver && (
        <div className="text-red-500 text-xl font-bold animate-pulse">
          GAME OVER! Final Score: {score}
        </div>
      )}

      <div className="text-[#00ff00] text-sm text-center">
        Use Arrow Keys or WASD to move
      </div>
    </div>
  );
}

