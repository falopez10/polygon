import React from 'react';
import './App.css';
import { Canvas } from './components/Canvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Create your own polygon!</h2>
      </header>
      <main>
        <Canvas />
      </main>
    </div>
  );
}

export default App;
