import React, {Component} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';


export default class OrdersList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {orders: []};
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.get('http://localhost:4000/api/orders/view' ,{ headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({orders: response.data});
             })
             .catch(function(error) {
                if(error.response.data.message)
                alert(error.response.data.message);
                 console.log(error);
             })
    }

    


    render() {
        let user = localStorage.getItem('user_name');
        return (
            <div>
                <h2>{user}'s orders:</h2>
                <br></br>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Vendor</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.orders.map((Order, i) => {
                            if(Order.status == "Waiting")
                            return (
                                <tr key={i}>
                                    <td>{Order.product.name}</td>
                                    <td>{Order.quantity} </td>
                                    <td>{Order.status} </td>
                                    <td>{Order.product.vendor.username} </td>
                                    <td ><Link to={{ pathname: '/edit', state: { 'id': Order._id} }}>Edit</Link></td>
                                </tr>
                            )

                            else 
                            return (
                                <tr key={i}>
                                    <td>{Order.product.name}</td>
                                    <td>{Order.quantity} </td>
                                    <td>{Order.status} </td>
                                    <td>{Order.product.vendor.username} </td>
                                    <td></td>
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