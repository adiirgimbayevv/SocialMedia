import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PostProvider } from './context/PostContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx'; // 👈 НОВЫЙ
import Toast from './components/Toast.jsx';                  // 👈 НОВЫЙ
import ErrorBoundary from './components/common/ErrorBoundary';

import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>        {/* 👈 оборачиваем */}
            <PostProvider>
              <ErrorBoundary>
                <App />
                <Toast />        {/* 👈 рендерим уведомления глобально */}
              </ErrorBoundary>
            </PostProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);