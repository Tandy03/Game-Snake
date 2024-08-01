// src/SnakeGame.js
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

  useEffect(() => {
    if (difficulty === 'EASY') setSpeed(200);
    else if (difficulty === 'HARD') setSpeed(100);
    else if (difficulty === 'IMPOSSIBLE') setSpeed(50);
  }, [difficulty]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        // Змінено для нарахування очок залежно від режиму
        let points = 1;
        if (difficulty === 'EASY') points = 2;       // При простому режимі додаємо 2 очки
        else if (difficulty === 'HARD') points = 3;  // При складному режимі додаємо 3 очки
        else if (difficulty === 'IMPOSSIBLE') points = 4; // При неможливому режимі додаємо 4 очки
        setScore(score + points);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, speed]);

  if (!difficulty) {
    return <DifficultySelector setDifficulty={setDifficulty} />;
  }

  return (
    <div className="game-container">
      <h1 className="title">Snake Game</h1>
      <p>Score: {score}</p>
      <div className="game-board">
        {snake.map((segment, index) => (
          <div key={index} className={`snake-segment ${index === 0 ? 'head' : ''}`} style={{ left: `${segment.x * (100 / boardSize)}%`, top: `${segment.y * (100 / boardSize)}%` }}></div>
        ))}
        <div className="food" style={{ left: `${food.x * (100 / boardSize)}%`, top: `${food.y * (100 / boardSize)}%` }}></div>
      </div>
    </div>
  );
};

export default SnakeGame;
