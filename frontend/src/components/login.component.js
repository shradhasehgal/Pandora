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
            .then(res => {
                console.log(res.data);
                localStorage.setItem('token', res.data.token.token);
                localStorage.setItem('user_type', res.data.token.user.type);
                localStorage.setItem('user_name', res.data.token.user.username);
                localStorage.setItem('user_id', res.data.token.user._id);
                this.props.history.push("/dashboard");
                window.location.reload();
            })
            .catch(err => console.log(err));

        this.setState({
            username: '',
            password: '',
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