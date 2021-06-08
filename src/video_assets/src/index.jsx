import React from 'react';
import ReactDOM from 'react-dom';
import { AppRouter } from './AppRouter';
import './styles/index.css';
import './styles/App.css';

function App() {
  return <AppRouter />;
}

ReactDOM.render(<App />, document.getElementById('root'));
