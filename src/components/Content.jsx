import React, { useEffect } from 'react';
import labs from './labs.jsx';

const Content = ({ selectedLab }) => {
    useEffect(() => {
        console.log('Content component mounted');
        
        return () => {
            console.log('Content component unmounted');
        };
    }, []);

    useEffect(() => {
        console.log('Selected lab changed:', selectedLab);
    }, [selectedLab]);

    const lab = labs.find(lab => lab.title === selectedLab);

    return (
        <div style={{ padding: '20px' }}>
            {lab ? lab.content : <h2>Выберите лабораторную работу из меню</h2>}
        </div>
    );
};

export default Content; 
