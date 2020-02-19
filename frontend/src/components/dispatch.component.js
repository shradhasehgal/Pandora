import React, {Component} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'

export default class Dispatch extends Component {
    
    constructor(props) {
        super(props);
        this.productDispatch = this.productDispatch.bind(this);
        this.state = {listings: []}
    }



    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }    

        axios.post('http://localhost:4000/api/products/view',{'type': 3},{ headers: headers} )
            .then(response => {
                console.log(response.data);
                this.setState({listings: response.data});
            })
            .catch(function(error) {
                if(error.response.data.message)
                    alert(error.response.data.message);
                console.log(error);
            })
    }
    productDispatch = this.productDispatch;

    productDispatch(id) {
        let token = localStorage.getItem('token');
        console.log(token);
        const Product = {
            id: id,
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }    
        axios.post('http://localhost:4000/api/products/dispatch',Product, {headers: headers})
            .then(response => { console.log(response.data)})
            .catch(err => {
                if(err.response.data.message)
                    alert(err.response.data.message);
                console.log(err)});
    
        window.location.reload();
    

    }

    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.listings.map((product, i) => {
                            return (
                                <tr key={i}>
                                    <td>{product.name}</td>
                                    <td>{product.no_orders}</td>
                                    <td><Button variant="success" onClick={() => {this.productDispatch(product._id) }}>Dispatch</Button></td>
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