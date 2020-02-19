import React, {Component} from 'react';
import axios from 'axios';


export default class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:'',
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const User = {
            username: this.state.username,
            password:  this.state.password,
        }

        console.log(User)
        axios.post('http://localhost:4000/api/users/login', User)
            .then(response => {
                console.log(response.data.message);
                localStorage.setItem('token', response.data.token.token);
                localStorage.setItem('user_type', response.data.token.user.type);
                localStorage.setItem('user_name', response.data.token.user.username);
                localStorage.setItem('user_id', response.data.token.user._id);
                this.props.history.push("/");
                window.location.reload();
            })
            .catch(err => {
                if(err.response.data.message)
                    alert(err.response.data.message);
                console.log(err.response);
                this.setState({
                    username : '',
                    password:''
                });
            });

    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.username}
                               onChange={this.onChangeUsername}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
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