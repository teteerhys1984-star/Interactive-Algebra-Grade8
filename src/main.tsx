import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/global.css';
import './styles/catalog.css';
import './styles/lesson.css';
import './styles/interactive.css';
import './styles/lesson2.css';
import './styles/lesson3.css';
import './styles/lesson4.css';
import './styles/assessment.css';
import './styles/teacher.css';
import './styles/tests.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
