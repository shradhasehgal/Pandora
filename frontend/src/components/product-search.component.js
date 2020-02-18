import React, {Component} from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"
import { BrowserRouter as Router, Route, Link} from "react-router-dom";


export default class Search extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            products: []
        }
        this.onChangeSearch = this.onChangeSearch.bind(this);
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

    onSubmit(e) {
        e.preventDefault();

        const Search = {
            name: this.state.search,
        }

        console.log(Search);

        axios.post('http://localhost:4000/api/products/search', Search)
             .then(res => {
                console.log(res.data);
                this.setState({products: res.data});

            })
             .catch(err => console.log(err));

        this.setState({
            search : ''
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
          .then(response => { console.log(response.data)})
          .catch(err => console.log(err));
    
        this.setState({
          quantity:''
    
        })

        window.location.reload();
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
                                    <td><Link to={{ pathname: '/vendor', state: { id: Product.vendor._id} }}>{Product.vendor.username} </Link></td>
                                    <td>{rating}</td>
                                    {/* <form onSubmit={this.onOrder}> */}
                                    <td><input type="number" value={this.state.quantity} onChange={this.onChangeQuantity}/> </td>
                                    <td><button onClick={() => {this.placeOrder(Product._id) }}>Buy</button></td>
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