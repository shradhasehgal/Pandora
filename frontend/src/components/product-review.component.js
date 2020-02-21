import React, {Component} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'

export default class Listings extends Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
                        listings: [],
                        text:'',
                        quantity: 1,
                        order: ''
                    }
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
          }    

        axios.post('http://localhost:4000/api/orders/type-view',{'type': '2'}, { headers: headers} )
             .then(response => {
                console.log(response.data)
                this.setState({listings: response.data});
             })
             .catch(function(error) {
                if(error.response.data.message)
                alert(error.response.data.message);
                 console.log(error);
             })
    }

    onClick(i) {
        this.setState({order: i})
        this.setState({ 
            showResults: true,
            listings: this.state.listings.filter(el => el._id !== i)
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
                            <th>Review</th>
                            {/* <th>Rating</th>
                            <th>Submit</th> */}
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.listings.map((order, i) => {
                        return (
                            <tr key={i}>
                                    <td>{order.product.name}</td>
                                    <td>{order.product.vendor.username}</td>
                                    <td><Button variant="primary" onClick={() => this.onClick(order._id)}>Review</Button></td>
                                </tr>
                            
                            )
                        })
                    }
                    </tbody>

                </table>
                { this.state.showResults ? <Results order={this.state.order}/> : null }

            </div>
        )
    }
}

class Results extends Component {
    constructor(props) {
        super(props);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        ///this.onClick = this.onClick.bind(this);
        this.state = 
        {
                //listings: [],
                text:'',
                quantity: 1
        }

    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
    }

    onChangeText(event) {
        this.setState({ text: event.target.value });
    }

    rateVendor(id) {
        let token = localStorage.getItem('token');
        console.log(token);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        
        const Review = {
            id: id,
            rating: this.state.quantity,
            review: this.state.text
        }

        if(!this.state.text) alert('Kindly fill review')
        else
        {
            axios.post('http://localhost:4000/api/products/review',Review, {headers: headers})
          .then(response => { alert('Response recorded! Thank you for your time.'); console.log(response.data)})
          .catch(function(error) {
            if(error.response.data.message)
            alert(error.response.data.message);
             console.log(error);
            })
        
            this.setState({
            text: '',
            quantity: 1
            })
        }
    }


    render() {
        return (
            <div>

            <textarea rows="5" cols="80" id="TITLE" value={this.state.text} onChange={this.onChangeText}></textarea>
            <br></br>
            <br></br>
                <select style={{width: '200px'}} className="form-control"  value={this.state.quantity} onChange={this.onChangeQuantity}> 
                <option name="1" value="1">1</option>
                <option name="2" value="2">2</option>
                <option name="3" value="3">3</option>
                <option name="4" value="4">4</option>
                <option name="5" value="5">5</option>
            </select>
            <br></br>
            <td><Button variant="primary" onClick={() => {console.log(this.props.order); this.rateVendor(this.props.order) }}>Submit Review</Button></td>
            </div>
        )
    }
}
