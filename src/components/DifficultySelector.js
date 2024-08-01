// src/DifficultySelector.js
import React from 'react';

const DifficultySelector = ({ setDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <h2 className = 'difficulty'>Select Difficulty</h2>
      <button className = 'diffButton1' onClick={() => setDifficulty('EASY')}>Easy</button>
      <button className = 'diffButton2' onClick={() => setDifficulty('HARD')}>Hard</button>
      <button className = 'diffButton3' onClick={() => setDifficulty('IMPOSSIBLE')}>Impossible</button>
    </div>
  );
};

export default DifficultySelector;
