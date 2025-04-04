import React from 'react';
import labs from './labs.jsx';

const Content = ({ selectedLab }) => {
  const lab = labs.find(lab => lab.title === selectedLab);

  return (
    <div style={{ padding: '20px' }}>
      {lab ? lab.content : <h2>Выберите лабораторную работу из меню</h2>}
    </div>
  );
};

export default Content;