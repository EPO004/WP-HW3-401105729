import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ShapeCounter from './components/ShapeCounter';
import './App.css';

function App() {
  const [shapes, setShapes] = useState([]);
  const [dragShape, setDragShape] = useState(null);

  const handleSelect = (shape) => {
    setDragShape(shape);
  };

  const handleDropShape = (shape, x, y) => {
    setShapes([...shapes, { type: shape, x, y }]);
  };

  const handleDeleteShape = (index) => {
    setShapes(shapes.filter((_, i) => i !== index));
  };

  const handleExport = async () => {
    const name = prompt("Enter a name to save your drawing:"); 
    if (!name) return; 

    try {
      const response = await fetch('http://localhost:3001/api/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, shapes }) 
      });

      if (response.ok) {
        alert('Drawing saved to server!');
      } else {
        alert('Error saving drawing to server');
      }
    } catch (error) {
      alert('Error saving drawing to server: ' + error.message);
    }
  };

  const handleImport = async () => {
    const name = prompt("Enter the name of the drawing to load:");
    if (!name) return;

    try {
      const response = await fetch(`http://localhost:3001/api/drawings/${name}`);
      if (response.ok) {
        const data = await response.json();
        setShapes(data.shapes); 
        alert('Drawing loaded from server!');
      } else {
        alert('Drawing not found');
      }
    } catch (error) {
      alert('Error loading drawing: ' + error.message);
    }
  };

  return (
    <div className="App">
      <Header onExport={handleExport} onImport={handleImport} />
      <div className="main-content">
        <Sidebar onSelect={handleSelect} />
        <Canvas shapes={shapes} onDropShape={handleDropShape} onDeleteShape={handleDeleteShape} />
      </div>
      <ShapeCounter shapes={shapes} />
    </div>
  );
}

export default App;
