// -----------------------------------------------------------------------------
// main.tsx
// 🧠 Startfilen för hela React-appen
// Härifrån "kickar" allt igång och laddas in i webbläsaren
// -----------------------------------------------------------------------------


// 📦 Import från React-biblioteket
// createRoot används för att "starta" appen i HTML-dokumentet (index.html)
import { createRoot } from 'react-dom/client';


// 🌍 BrowserRouter = React Router (routing-system)
// Den här komponenten gör att vi kan använda olika URL:er som t.ex. /cart eller /checkout
// utan att sidan laddas om varje gång (Single Page Application)
import { BrowserRouter } from 'react-router-dom';


// 🎨 Importerar globala CSS-stilar för hela appen
// Detta gör så att t.ex. bakgrundsfärg, typsnitt osv. gäller överallt
import './index.css';


// 🧩 Importerar huvudkomponenten "App"
// (export default "App") från App.tsx innehåller alla våra sidor och layout (t.ex. Header, Footer, Routes)
import App from './App.tsx';


// -----------------------------------------------------------------------------
// 🚀 Här startar själva appen och säger "rendera detta i HTML-elementet med id='root'"
// -----------------------------------------------------------------------------


// Vi hämtar HTML-elementet <div id="root"> från index.html 
// Och säger: "rendera React-appen här!"                      (standard att göra i rooten)
createRoot(document.getElementById('root')!).render(

  // Vi wrappar in <App /> i <BrowserRouter> för att routing ska funka
  // Så vi kan gå till olika sidor som /checkout eller /product/:slug
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
