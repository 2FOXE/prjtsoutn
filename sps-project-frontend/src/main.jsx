// main.jsx (entry point)
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import './index.css';
import App from './App'; // Import the App component
import { Provider } from 'react-redux';
import store from './redux/store.js'; // Import the Redux store
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter for routing
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// Create the root element where the app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the entire app inside the root container
root.render(
  <Provider store={store}> {/* Wrap app in Redux Provider */}
    <Router> {/* Wrap the entire app with Router to allow navigation */}
      <App /> {/* Render the App component */}
    </Router>
  </Provider>
);

