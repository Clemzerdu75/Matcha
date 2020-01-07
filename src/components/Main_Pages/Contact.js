import React, {Component} from "react";
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';

import Profil from '../Other Components/Profil';

import {CheckifBlocked} from './../../lib';

class Contact extends Component {
	constructor() {
		 super()
		 this.state = {
			 pseudo: window.localStorage.pseudo, // Get the user pseudo form local storage
			 loading: false, // Handle loading state
			 user: [], // will get the list of user that  match the logged user
			 error: false, // handle error state
			 blocked: [], // handle if some user are blocked to not show them
		 }
		 this.Rerender = this.Rerender.bind(this)
	 }
	 
	 componentDidMount() { // Will get all the user who match the logged user and the list of user blocked and who block the logged user to sort the list
		 const request = `http://localhost:8080/relation/match/${this.state.pseudo}`
		 this.setState({loading: true})
		 axios.get(request)
			.then(response => response.data)
			.then(data => {
				 this.setState({
					 loading: false,
					 user: data,
				 })
			})
			.catch(error => {
				this.setState({
					loading: false,
					error: true
				})
			})
		axios.get(`http://localhost:8080/relation/block/userblock/${this.state.pseudo}`)
		.then(response => response.data)
			.then(data => {
				this.setState({
					loading: false,
					blocked: data,
				})
			})
	   axios.get(`http://localhost:8080/relation/block/blockuser/${this.state.pseudo}`)
		 .then(response => response.data)
			.then(data => {
			  let prev_blocked = this.state.blocked.length ? this.state.blocked.concat(data) : data
			  this.setState({
				  loading: false,
				  blocked: prev_blocked,
			  })
			})
	}
	
	Rerender() { // Will handle the refresh if you block someone
		axios.get(`http://localhost:8080/relation/block/userblock/${this.state.pseudo}`)
			.then(response => response.data)
            .then(data => {
                this.setState({
                    loading: false,
					blocked: data,
				})
			})
		axios.get(`http://localhost:8080/relation/block/blockuser/${this.state.pseudo}`)
			.then(response => response.data)
            .then(data => {
				let prev_blocked = this.state.blocked.length ? this.state.blocked.concat(data) : data
                this.setState({
                    loading: false,
					blocked: prev_blocked,
				})
			})
		this.setState({ state: this.state });
	}
	 
	 render() {
		 const text = this.state.loading ? "loading..." : "Contact"
		 let libraries = CheckifBlocked(this.state.user, this.state.blocked)
		 const UserProfil =libraries.map(item => <Profil key={item.pseudo} item={item}  Rerender={this.Rerender}/>)
		 return (
			 <div className="body">

				 {/* Title */}
				 <h1>{text}</h1>

				 {/* If the list if empty or there is an error */ }
				 {this.state.error ? <h3 style={{marginTop: "100px", textAlign: "center", color: "#8E8E8E"}}>You don't have any contact to discuss with yet</h3> : null}

				 {/* Display the list of user you match */}
				 <Container className="table" >  
					 <Row className="justify-content-md-center" >
						 {UserProfil}
					 </Row>
				 </Container>
			 </div>		
		 )
	 }
 }

export default Contact
