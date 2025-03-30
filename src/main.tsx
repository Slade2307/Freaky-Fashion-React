// -----------------------------------------------------------------------------
// main.tsx
// This is where your React app starts running --             (((NOTE: Component = Reusable building block for your website or app. Ex. "createRoot", "BrowserRouter")))
// -----------------------------------------------------------------------------

// createRoot is used to start the React app
import { createRoot } from 'react-dom/client';

// BrowserRouter lets you use routes (e.g. /cart, /checkout)
import { BrowserRouter } from 'react-router-dom';

// Global CSS styles for the app
import './index.css';

// Main App component that holds all your pages and layout
import App from './App.tsx';

// -----------------------------------------------------------------------------
// Render the React app inside the HTML element with id="root"
// We also wrap it in BrowserRouter so routing works
// -----------------------------------------------------------------------------

createRoot(document.getElementById('root')!).render(
  // BrowserRouter lets us navigate between pages like /cart or /product/123
  <BrowserRouter> 
    <App /> 
  </BrowserRouter>
);

