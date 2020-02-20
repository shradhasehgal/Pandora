import React, {Component} from 'react';
import axios from 'axios';

// import CustomerNavbar from "./user-navbar.component"

export default class Reviews extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            listings: [],
            id: this.props.location.state.id,
            vendor: this.props.location.state.name,
        }
    }
    

    componentDidMount() 
    {
        let id = this.state.id;
        console.log(id);
        axios.post('http://localhost:4000/api/pro',{'id': id})
             .then(response => {
                console.log(response.data)
                this.setState({listings: response.data});
             })
             .catch(function(error) {
                if(error.response.data.message)
                alert(error.response.data.message);
                console.log(error);
            })
        


        // window.location.reload();
    }

    render() {
        let vendor = this.state.vendor;
        console.log(vendor);
        return (
            <div>
                <h3>{vendor}'s reviews</h3>
                <table className="table table-striped">
                    <tbody>
                    { 
                        this.state.listings.map((product, i) => {
                            return (
                                <div>

                                    <thead className="table table-striped" key={i}>
                                       <th>{product.name}</th>
                                    </thead>
                                    <table className="table table-striped">
                                        {
                                            product.reviews.map((review, j) => {
                                                return (
                                                    <tr key={j}>
                                                        <td>{review.review}</td>
                                                        <td>{review.rating} </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>
                                    <br></br>
                                    <br></br>
                                </div>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}