import React, {Component} from 'react';
import axios from 'axios';

export default class AddProduct extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            quantity:'',
            price: ''
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeName(event) {
        this.setState({ name: event.target.value });
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onChangePrice(event) {
        this.setState({ price: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newProduct = {
            name: this.state.name,
            quantity: this.state.quantity,
            price:  this.state.price,
        }

        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }    
        console.log(newProduct);
        axios.post('http://localhost:4000/api/products/add', newProduct, {headers: headers})
            .then(res => console.log(res.data))
            .catch(function(error) {
                if(error.response.data.message)
                    alert(error.response.data.message);
                console.log(error);
            })
        this.setState({
            name: '',
            quantity: '',
            price: ''
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
                               value={this.state.name}
                               onChange={this.onChangeName}
                               />
                    </div>
                    
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.price}
                               onChange={this.onChangePrice}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Quantity: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.quantity}
                               onChange={this.onChangeQuantity}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Add listing" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}