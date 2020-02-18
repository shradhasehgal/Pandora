import React, {Component} from 'react';
import axios from 'axios';

export default class Listings extends Component {
    
    constructor(props) {
        super(props);
        this.deleteProduct = this.deleteProduct.bind(this)
        this.state = {listings: []}
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.post('http://localhost:4000/api/products/view',{'type': 1}, { headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({listings: response.data});
             })
             .catch(function(error) {
                 console.log(error);
             })
    }


    deleteProduct(id) {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }    
        axios.delete('http://localhost:4000/api/products/delete/', {
            headers: { 'Authorization':token },
            data: {
              'id': id
            }
          })
          .then(response => { console.log(response.data)});
    
        this.setState({
          listings: this.state.listings.filter(el => el._id !== id)
        })
    }

    deleteProduct = this.deleteProduct;

    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity left</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.listings.map((product, i) => {
                            return (
                                <tr key={i} deleteProduct = {this.deleteProduct}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity} </td>
                                    <td> <a href="#" onClick={() => {this.deleteProduct(product._id) }}>delete</a></td>
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