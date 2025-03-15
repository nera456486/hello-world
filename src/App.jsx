import React from 'react';
import Button from './components/Button';
import Container from './components/Container';
import Navigation from './components/Navigation';

const App = () => {
    const handleClick = () => {
        alert('Hello World!');
    };

    return (
        <div>
            <Navigation />
            <Container>
                <h1>Hello World</h1>
                <Button text="Click Me" onClick={handleClick} />
            </Container>
        </div>
    );
};

export default App;
