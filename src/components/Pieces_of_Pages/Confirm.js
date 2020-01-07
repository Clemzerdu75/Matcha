import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Confirm extends Component {
	constructor(props) {
		super(props);
		this.state = {
      validated:false
		}
  }

  componentWillMount = () => {
    const searchParams = new URLSearchParams(this.props.location.search);
    let query = {
      token: searchParams.get('token'),
      pseudo: searchParams.get('pseudo')
    }
    if (!query.token || !query.pseudo){
      return null
    } else {
      axios.get(`http://localhost:8080/ValidateAccount/${query.token}/${query.pseudo}`)
      .then((result) => {
        this.setState({
          validated:true,
        })
      })
      .catch((
        this.setState({
          validated:false,
        })
      ))
    }
  }
  render = () => this.state.validated === true ?
      <div className="body" style={{backgroundColor: "white", zIndex: "50", position: "absolute", margin: "0 auto", width: "1000%", height: "1000%", marginTop: "-33%"}}>
        <h1>Account Validated</h1>
        <Link to="/"><h3 style={{margin: "0 auto", }}>Go to landing page</h3></Link>
      </div> 
      :
      <div className="body" style={{backgroundColor: "white", zIndex: "50", position: "absolute", margin: "0 auto", width: "1000%", height: "1000%", marginTop: "-33%"}}>
        <h1>Account Not Validated</h1>
        <Link to="/"><h3 style={{margin: "0 auto", }}>Go to landing page</h3></Link>
      </div>

}

export default Confirm
