import React, {Component} from 'react';
import axios from 'axios';

export default class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password:'',
        }
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const User = {
            email: this.state.email,
            password:  this.state.password,
        }

        console.log(User)

        axios.post('http://localhost:4000/api/users/login', User)
             .then(res => console.log(res.data))
             .catch(err => console.log(err));

        this.setState({
            email: '',
            password: '',
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.email}
                               onChange={this.onChangeEmail}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}