import React, { useState } from 'react';
import Button from './components/Button';
import Container from './components/Container';
import Navigation from './components/Navigation';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Menu from './components/layout/Menu';
import Content from './components/Content';

const App = () => {
    const [selectedLab, setSelectedLab] = useState(null);

    const handleClick = () => {
        alert('Hello World!');
    };

    return (
        <div>
            <Header />
            <Navigation />
            <Menu onSelectLab={setSelectedLab} />
            <Container>
                <h1>Hello World</h1>
                <Button text="Click Me" onClick={handleClick} />
                <Content selectedLab={selectedLab} />
            </Container>
            <Footer />
        </div>
    );
};

export default App;