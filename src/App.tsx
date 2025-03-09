import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home'; // Your Home component
import ProductDetails from './pages/ProductDetails'; // Your ProductDetails component

const App = () => {
  return (
    <Router>
      <Switch>
        {/* Home Route */}
        <Route exact path="/" component={Home} />
        
        {/* Product Details Route */}
        <Route path="/product/:slug" component={ProductDetails} />
      </Switch>
    </Router>
  );
};

export default App;
