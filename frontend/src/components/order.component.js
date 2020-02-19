import React, {Component} from 'react';
import axios from 'axios';

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
                                <tr key={i}>
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