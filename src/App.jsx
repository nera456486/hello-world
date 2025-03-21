import React, { useState } from 'react';
import Button from './components/Button';
import Container from './components/Container';
import Navigation from './components/Navigation';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Menu from './components/layout/Menu';
import Content from './components/Content';

const App = () => {
    const [selectedLab, setSelectedLab] = useState('Лабораторная работа 1'); // Установите начальное значение

    const handleClick = () => {
        alert('Hello World!');
    };

    return (
        <div>
            <Header />
            <Navigation />
            <Menu onSelectLab={setSelectedLab} /> {/* Передаем функцию выбора лабораторной работы */}
            <Container>
                <h1>Hello World</h1>
                <Button text="Click Me" onClick={handleClick} />
                <Content selectedLab={selectedLab} /> {/* Отображаем содержимое выбранной лабораторной работы */}
            </Container>
            <Footer />
        </div>
    );
};

export default App;
