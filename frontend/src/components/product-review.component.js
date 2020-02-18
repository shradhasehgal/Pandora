import React, {Component} from 'react';
import axios from 'axios';

export default class Reviews extends Component {
    
    constructor(props) {
        super(props);
        this.state = {reviews: []}
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let id = localStorage.getItem('user_id');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.get('http://localhost:4000/api/vendors/view',{'id': id}, { headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({reviews: response.data});
             })
             .catch(function(error) {
                 console.log(error);
             })
    }


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
                            let left = 0;
                            if(product.quantity > product.no_orders) left = product.quantity - product.no_orders; 
                            else left = 0;
                            return (
                                <tr key={i} deleteProduct = {this.deleteProduct}>
                                    <td>{product.name}</td>
                                    <td>{left} </td>
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