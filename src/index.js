// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { AuthProvider } from './auth/AuthContext';
// import { Provider } from 'react-redux';
// import store from './store/store';
// import './dashboard/Tab/vertical.css'
// // import ThemeProvider from './theme/ThemeProvider';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <AuthProvider>
//         {/* <ThemeProvider> */}
//           <App />
//         {/* </ThemeProvider> */}
//       </AuthProvider>
//     </Provider>
//   </React.StrictMode>,
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// index.js or wherever you render your app
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './auth/AuthContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { DarkModeProvider } from './theme/Darkmode';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

reportWebVitals();