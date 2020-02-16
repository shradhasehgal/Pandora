import React, {Component} from 'react';
import axios from 'axios';

export default class Search extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            search: '',
        }
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChangeSearch(event) {
        this.setState({ search: event.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const Search = {
            name: this.state.search,
        }

        axios.post('http://localhost:4000/api/products/search', Search)
             .then(res => console.log(res.data))
             .catch(err => console.log(err));

        this.setState({
            search : ''
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
                               value={this.state.search}
                               onChange={this.onChangeSearch}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}