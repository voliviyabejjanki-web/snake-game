import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Score</span>
          <span className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40">Status</span>
          <span className={`text-sm font-bold uppercase ${gameOver ? 'text-rose-500' : isPaused ? 'text-amber-400' : 'text-emerald-400'}`}>
            {gameOver ? 'Game Over' : isPaused ? 'Paused' : 'Playing'}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-zinc-900/50 rounded-xl overflow-hidden border-2 border-white/5 shadow-inner"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/20" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`snake-${i}`}
            className={`rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10' : 'bg-cyan-600/80'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20"
            >
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-black text-rose-500 uppercase tracking-tighter">Game Over</h2>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 transition-colors shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-cyan-400 uppercase tracking-tighter">Paused</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  >
                    Resume
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-xs text-white/30 font-mono">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
}
