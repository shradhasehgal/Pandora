import React, {Component} from 'react';
import axios from 'axios';

export default class Dispatch extends Component {
    
    constructor(props) {
        super(props);
        this.state = {listings: []}
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.post('http://localhost:4000/api/products/view',{'type': 2},{ headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({listings: response.data});
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
                            return (
                                <tr key={i}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity} </td>
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