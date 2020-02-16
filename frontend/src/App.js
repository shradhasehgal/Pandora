import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

import Navbar from "./components/navbar.component"
import Register from "./components/register.component";
import Login from "./components/login.component";
import Search from "./components/search.component";
import Product from "./components/product.component";
import Vendor from "./components/vendor-product.component";
import Orders from "./components/order.component";
import Front from "./components/front.component";



function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      
      <Route path="/" component={Front} />
      <Route path="/register" component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/search" exact component={Search} />
      <Route path="/products" exact component={Product} />
      <Route path="/vendor" exact component={Vendor} />
      <Route path="/orders" exact component={Orders} />
      </div>

    </Router>
  );
}

export default App;
