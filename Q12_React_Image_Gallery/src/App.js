import React from 'react';
import Images from './components/Images';
import './App.css';

function App() {
  return (
    <div className='app-shell'>
      <header className='header content'>
        <h2 className='subtitle'>React Infinite Scroll</h2>
        <h1 className='title'>Client-Side Image Gallery</h1>
        <p className='description'>
          Infinite loading is implemented with Intersection Observer and local
          data only.
        </p>
      </header>
      <Images />
    </div>
  );
}

export default App;
