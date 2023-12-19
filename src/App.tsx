import React from 'react';
import { Link } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>React Virtual Scroll Tables R&D</h1>
      <div className='table-content-container'>
        <nav className='table-list-container'>
          <Link className='tabe-item' to="/prime-table">
            Prime Table
          </Link>
          <Link className='tabe-item' to="/ka-table">
            KA Table
          </Link>
          <Link className='tabe-item' to="/tanstack-table">
            Tans Stack Table
          </Link>
          <Link className='tabe-item' to="/ag-table">
            AG Grid
          </Link>
        </nav >
      </div>
    </div>
  );
}

export default App;
