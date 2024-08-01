import React, { useState, useEffect } from 'react';
import './SnakeGame.css';
import DifficultySelector from './components/DifficultySelector';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(60000);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(null);

  const boardSize = 20;
  let touchStartX = 0;
  let touchStartY = 0;

  useEffect(() => {
    if (difficulty === 'EASY') setSpeed(200);
    else if (difficulty === 'HARD') setSpeed(100);
    else if (difficulty === 'IMPOSSIBLE') setSpeed(50);
  }, [difficulty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'ц':
          setDirection((prev) => (prev !== 'DOWN' ? 'UP' : prev));
          break;
        case 'ArrowDown':
        case 's':
        case 'ы':
        case 'і':
          setDirection((prev) => (prev !== 'UP' ? 'DOWN' : prev));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'ф':
          setDirection((prev) => (prev !== 'RIGHT' ? 'LEFT' : prev));
          break;
        case 'ArrowRight':
        case 'd':
        case 'в':
          setDirection((prev) => (prev !== 'LEFT' ? 'RIGHT' : prev));
          break;
        case ' ':
          setDirection((prev) => (prev !== 'PAUSE' ? 'PAUSE' : prev));
          break;
        default:
          break;
      }
    };

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!touchStartX || !touchStartY) {
        return;
      }

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          setDirection((prev) => (prev !== 'RIGHT' ? 'LEFT' : prev));
        } else {
          setDirection((prev) => (prev !== 'LEFT' ? 'RIGHT' : prev));
        }
      } else {
        if (diffY > 0) {
          setDirection((prev) => (prev !== 'DOWN' ? 'UP' : prev));
        } else {
          setDirection((prev) => (prev !== 'UP' ? 'DOWN' : prev));
        }
      }

      touchStartX = 0;
      touchStartY = 0;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [direction]);

  const checkCollision = (head, snake) => {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const moveSnake = () => {
      if (direction === 'PAUSE') return; // Додаємо перевірку на паузу

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          if (head.y < 0) {
            alert('Game Over! You hit the wall.');
            setSnake([{ x: 10, y: 10 }]);
            setDirection('RIGHT');
            setFood({ x: 15, y: 15 });
            setScore(0);
            return;
          }
          break;
        case 'DOWN':
          head.y += 1;
          if (head.y >= boardSize) {
            alert('Game Over! You hit the wall.');
            setSnake([{ x: 10, y: 10 }]);
            setDirection('RIGHT');
            setFood({ x: 15, y: 15 });
            setScore(0);
            return;
          }
          break;
        case 'LEFT':
          head.x -= 1;
          if (head.x < 0) {
            alert('Game Over! You hit the wall.');
            setSnake([{ x: 10, y: 10 }]);
            setDirection('RIGHT');
            setFood({ x: 15, y: 15 });
            setScore(0);
            return;
          }
          break;
        case 'RIGHT':
          head.x += 1;
          if (head.x >= boardSize) {
            alert('Game Over! You hit the wall.');
            setSnake([{ x: 10, y: 10 }]);
            setDirection('RIGHT');
            setFood({ x: 15, y: 15 });
            setScore(0);
            return;
          }
          break;
        default:
          break;
      }

      newSnake.unshift(head);
      if (checkCollision(head, newSnake)) {
        alert('Game Over! You collided with yourself.');
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        setFood({ x: 15, y: 15 });
        setScore(0);
        return;
      }

      if (head.x === food.x && head.y === food.y) {
        setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
        setScore((prevScore) => {
          let points = 1;
          if (difficulty === 'EASY') points = 2;
          else if (difficulty === 'HARD') points = 3;
          else if (difficulty === 'IMPOSSIBLE') points = 4;
          return prevScore + points;
        });
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, speed, food.x, food.y, difficulty]);

  if (!difficulty) {
    return <DifficultySelector setDifficulty={setDifficulty} />;
  }

  return (
    <div className="game-container">
      <h1 className="title">Snake Game</h1>
      <p>Score: {score}</p>
      <div className="game-board">
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? 'head' : ''}`}
            style={{
              left: `${(segment.x * 100) / boardSize}%`,
              top: `${(segment.y * 100) / boardSize}%`,
            }}
          ></div>
        ))}
        <div
          className="food"
          style={{
            left: `${(food.x * 100) / boardSize}%`,
            top: `${(food.y * 100) / boardSize}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default SnakeGame;
