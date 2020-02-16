import React, {Component} from 'react';
import axios from 'axios';

export default class OrdersList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {orders: []}
    }

    componentDidMount() {
        // token = localStorage.getItem('token');
        // axios.post('http://localhost:4000/orders', { headers: { Authorization: token } })
        axios.get('http://localhost:4000/api/orders')

             .then(response => {
                 console.log(response.data)
                 this.setState({orders: response.data});
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
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Vendor</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.orders.map((Order, i) => {
                            return (
                                <tr>
                                    <td>{Order.product.name}</td>
                                    <td>{Order.quantity} </td>
                                    <td>{Order.status} </td>
                                    <td>{Order.product.vendor.username} </td>
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