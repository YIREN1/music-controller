import React from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
function App() {
  return <HomePage />;
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
