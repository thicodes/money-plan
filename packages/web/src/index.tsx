import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';
import App from './App';

const root = document.createElement('div');

document.body.appendChild(root);

ReactDOM.createRoot(root).render(<App />);
