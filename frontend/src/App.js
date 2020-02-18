import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component"
import CustomerNavbar from "./components/customer-navbar.component"
import VendorNavbar from "./components/vendor-navbar.component"
import Register from "./components/register.component";
import Login from "./components/login.component";
import Search from "./components/product-search.component";
import Listings from "./components/product-listings.component";
import AddProduct from "./components/add-product.component";
import Orders from "./components/order.component";
import Front from "./components/front.component";
import Dispatch from "./components/dispatch.component";
import Reviews from "./components/review.component";
import ProductReview from "./components/product-review.component";
import VendorReview from "./components/vendor-review.component";





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
            if(user_type === "V") 
            {
              console.log("1");
              return <AddProduct/>
            }
              else if(user_type === "C") 
              {
                console.log("2");
                return <Orders/>
              }

            else return <Front/>
          }}  />
          <Route path="/front" component={Front} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/search" component={Search} />
          <Route path="/listings" component={Listings} />
          <Route path="/add-product" component={AddProduct} />
          <Route path="/orders" component={Orders} />
          <Route path="/dispatch" component={Dispatch} />
          <Route path="/vendor" component={Reviews} />
          <Route path="/product-review" component={ProductReview} />
          <Route path="/vendor-review" component={VendorReview} />

        </div>

      </Router>
    );
  }
}

export default App;
