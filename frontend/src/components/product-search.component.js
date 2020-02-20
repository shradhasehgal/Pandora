import React, {Component} from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Button from 'react-bootstrap/Button'


export default class Search extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            products: [],
            type: 1
        }
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.sortbyRating = this.sortbyRating.bind(this);
        this.sortbyQuantity = this.sortbyQuantity.bind(this);
        this.sortbyPrice = this.sortbyPrice.bind(this);
        // this.onChangeType = this.onChangeType.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
    }


    
    onChangeSearch(event) {
        this.setState({ search: event.target.value });
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }


    onChangeType(event) {
        this.setState({ type: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const Search = {
            name: this.state.search,
            type: this.state.type
        }

        console.log(Search);
        axios.post('http://localhost:4000/api/products/search', Search)
             .then(res => {
                console.log(res.data);
                this.setState({products: res.data});

            })
             .catch(err =>
                {
                    if(err.response.data.message)
                    alert(err.response.data.message);
                    console.log(err)
                });

        this.setState({
            search : '',
        });
    }

    placeOrder(id) {
        let token = localStorage.getItem('token');
        console.log(token);
        const Order = {
            product: id,
            quantity: this.state.quantity
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }    
        axios.post('http://localhost:4000/api/orders/place',Order, {headers: headers})
          .then(response => { 
              alert("Order placed!");
              console.log(response.data)})
          .catch(err => console.log(err));
    
        this.setState({
          quantity:'',
          products: [],
    
        })

        // window.location.reload();
    }


    sortbyQuantity = () =>{
        let products = this.state.products, n = products.length;
        for(var i =0; i < n-1; i++)
        {
            for(var j=0; j < n-1; j++)
            {
                var left = products[j].no_orders - products[j].quantity;
                var left2 = products[j+1].no_orders - products[j+1].quantity;
                if(left < left2)
                {
                    var temp = products[j];
                    products[j] = products[j+1];
                    products[j+1] = temp;
                }
            }
        }
        this.setState({products: products});
    }

    sortbyRating = () =>{
        let products = this.state.products, n = products.length;
        for(var i =0; i < n-1; i++)
        {
            for(var j=0; j < n-1; j++)
            {
                var left = products[j].vendor.rating;
                var left2 = products[j+1].vendor.rating;
                if(left < left2)
                {
                    var temp = products[j];
                    products[j] = products[j+1];
                    products[j+1] = temp;
                }
            }
        }
        this.setState({products: products});
    }

    sortbyPrice = () =>{
        let products = this.state.products, n = products.length;
        for(var i =0; i < n-1; i++)
        {
            for(var j=0; j < n-1; j++)
            {
                var left = products[j].price;
                var left2 = products[j+1].price;
                if(left > left2)
                {
                    var temp = products[j];
                    products[j] = products[j+1];
                    products[j+1] = temp;
                }
            }
        }
        this.setState({products: products});
    }

    render() {
        // const { products} = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Product name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.search}
                               onChange={this.onChangeSearch}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                </form>
                <Button variant="info" onClick={this.sortbyPrice} >Order by price</Button> &nbsp; &nbsp;
                <Button variant="info" onClick={this.sortbyQuantity} >Order by quantity</Button>&nbsp; &nbsp;
                <Button variant="info" onClick={this.sortbyRating} >Order by rating</Button>
                <br></br>
                <br></br>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity left</th>
                            <th>Vendor</th>
                            <th>Rating</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {

                        this.state.products.map((Product, i) => {
                            console.log(Product.vendor);
                            let left = 0, rating =0;
                            if(Product.quantity > Product.no_orders) left = Product.quantity - Product.no_orders; 
                            else left = 0;
                            rating = Product.vendor.rating;
                    
                            //rating = product
                            return (
                                <tr key={i}>
                                    <td>{Product.name}</td>
                                    <td>{Product.price} </td>
                                    <td>{left}</td>
                                    <td><Link to={{ pathname: '/vendor', state: { id: Product.vendor._id, name: Product.vendor.username} }}>{Product.vendor.username} </Link></td>
                                    <td>{rating}</td>
                                    {/* <form onSubmit={this.onOrder}> */}
                                    <td><input type="number"  min="1" value={this.state.quantity} onChange={this.onChangeQuantity}/> </td>
                                    <td><Button variant="success" onClick={() => {this.placeOrder(Product._id) }}>Buy</Button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}