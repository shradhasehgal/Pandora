import React, {Component} from 'react';
import axios from 'axios';
// import CustomerNavbar from "./user-navbar.component"

export default class Search extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            products: []
        }
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeSearch(event) {
        this.setState({ search: event.target.value });
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

    render() {
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
                            <th>Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.products.map((Product, i) => {
                            return (
                                <tr key={i}>
                                    <td>{Product.name}</td>
                                    <td>{Product.price} </td>
                                    <td> {Product.quantity} </td>
                                    <td>{Product.vendor.username} </td>
                                    <td> YEET </td>
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