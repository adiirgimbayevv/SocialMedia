import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Добавляем провайдер Redux
import { store } from './store'; // Импортируем созданный тобой стор

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PostProvider } from './context/PostContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';

import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <PostProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </PostProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);