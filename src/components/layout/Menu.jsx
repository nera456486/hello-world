import React from 'react';

const Menu = ({ onSelectLab }) => {
    const labs = ['Лабораторная работа 1', 'Лабораторная работа 2', 'Лабораторная работа 3'];

    return (
        <nav>
            <ul>
                {labs.map((lab, index) => (
                    <li key={index} onClick={() => onSelectLab(lab)} style={{ cursor: 'pointer' }}>
                        {lab}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Menu;
