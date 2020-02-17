import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component"
import CustomerNavbar from "./components/customer-navbar.component"
import VendorNavbar from "./components/vendor-navbar.component"
import Register from "./components/register.component";
import Login from "./components/login.component";
import Search from "./components/product-search.component";
import Product from "./components/product.component";
import Vendor from "./components/vendor-product.component";
import Orders from "./components/order.component";
import Front from "./components/front.component";



class App extends React.Component {
  render() {
    let user_type = localStorage.getItem('user_type');  
    let navbar = null;
    if(user_type === "V")
      navbar = <VendorNavbar />;
    else if(user_type === "C")
      navbar = <CustomerNavbar />;
    else
      navbar = <Navbar />;

    
    return (
      <Router>
        <div className="container">
          {navbar}
          <br></br>
          <Route exact path="/" render={()=> {
            if(user_type === "V") return <Orders/>
            else if(user_type === "C") return <Orders/>
            else return <Front/>
          }}  />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/search" component={Search} />
          <Route path="/products" component={Product} />
          <Route path="/vendor" component={Vendor} />
          <Route path="/orders" component={Orders} />
          <Route path="/dashboard" component={Orders} />
        </div>

      </Router>
    );
  }
}

export default App;
