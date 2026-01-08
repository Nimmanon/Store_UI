// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'

// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './store/store.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   // </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie'; // 👈 เพิ่มบรรทัดนี้
import store from './store/store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider> {/* 👈 ครอบทั้งหมด */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
);
