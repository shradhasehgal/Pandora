import React, {Component} from 'react';
import axios from 'axios';

export default class Listings extends Component {
    
    constructor(props) {
        super(props);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.state = {listings: []}
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.post('http://localhost:4000/api/orders/type-view',{'type': '1'}, { headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({listings: response.data});
             })
             .catch(function(error) {
                 console.log(error);
             })
    }

    
    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    rateVendor(id, id2) {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        
        const Review = {
            id: id,
            rating: this.state.quantity
        }
        axios.post('http://localhost:4000/api/vendors/reviews',Review, {headers: headers})
          .then(response => { console.log(response.data)});
    
        this.setState({
          listings: this.state.listings.filter(el => el._id !== id2)
        })
    }


    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Vendor</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.listings.map((order, i) => {
                        return (
                            <tr key={i}>
                                    <td>{order.product.name}</td>
                                    <td>{order.product.vendor.username}</td>
                                    <select className="form-control"  value={this.state.quantity} onChange={this.onChangeQuantity}> 
                                        <option name="1" value="1">1</option>
                                        <option name="2" value="2">2</option>
                                        <option name="3" value="3">3</option>
                                        <option name="4" value="4">4</option>
                                        <option name="5" value="5">5</option>
                                    </select>
                                    {/* <td><input type="number" value={this.state.quantity} onChange={this.onChangeQuantity}/> </td> */}
                                    <td><button onClick={() => {this.rateVendor(order.product.vendor._id, i) }}>Rate</button></td>
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