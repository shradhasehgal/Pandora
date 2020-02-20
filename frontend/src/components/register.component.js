import React, {Component} from 'react';
import axios from 'axios';
export default class CreateUser extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:'',
            type: "C"
        }
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangeType(event) {
        this.setState({ type: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            type: this.state.type,
            password:  this.state.password,
        }
        console.log(newUser);
        axios.post('http://localhost:4000/api/users/add', newUser)
             .then(res => 
            {
                let noice = "Happy to have you on board, "+ res.data.username +"!";
                alert(noice);
                console.log(res.data)
            })
             .catch(err => {
                if(err.response.data.name)
                    alert(err.response.data.name);
                console.log(err)});

        this.setState({
            username: '',
            password: '',
            type: 'C'
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
                        <label>Type: </label>
                        <select className="form-control"  value={this.state.type} onChange={this.onChangeType}> 
                            <option name="C" value="C">Customer</option>
                            <option name="V" value="V">Vendor</option>
                        </select>
                        {/* <input type="text" 
                               className="form-control" 
                               value={this.state.type}
                               onChange={this.onChangeType}
                               />   */}
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
                        <input type="submit" value="Register" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}