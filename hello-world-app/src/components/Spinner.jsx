import React from 'react';
import './Spinner.css';

// Создаём компонент спиннера 
const Spinner = ({ small = false }) => {
  return (
    <div className={`spinner-container ${small ? 'small' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;