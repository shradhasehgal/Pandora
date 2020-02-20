import React, {Component} from 'react';
import axios from 'axios';


export default class Edit extends Component {
    
    constructor(props) {

        super(props);

        this.state = {
            username: '',
            id: this.props.location.state.id,
            password:'',
        }
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        let edit = {
            id: this.state.id,
            quantity: this.state.quantity
        }
        
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }   

        axios.post('http://localhost:4000/api/orders/edit', edit, {headers: headers})
            .then(response => {
                console.log(response.data.message);
                // localStorage.setItem('token', response.data.token.token);
                // localStorage.setItem('user_type', response.data.token.user.type);
                // localStorage.setItem('user_name', response.data.token.user.username);
                // localStorage.setItem('user_id', response.data.token.user._id);
                this.props.history.push("/");
                window.location.reload();
            })
            .catch(err => {
                if(err.response.data.message)
                    alert(err.response.data.message);
                console.log(err.response);
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>New quantity: </label>
                        <input type="number" min="1" 
                               className="form-control" 
                               value={this.state.quantity}
                               onChange={this.onChangeQuantity}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Edit quantity" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}