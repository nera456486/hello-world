import React from 'react';
import labs from '/Users/akulovnikita/hello-world-app/src/components/labs.jsx';

const Menu = ({ onSelectLab }) => {
    return (
        <nav>
            <ul>
                {labs.map((lab, index) => (
                    <li 
                        key={index} 
                        onClick={() => onSelectLab(lab.title)} 
                        style={{ cursor: 'pointer' }}
                    >
                        {lab.title}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Menu;