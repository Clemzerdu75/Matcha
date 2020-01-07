import React, {Component} from "react";
import axios from 'axios';
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

import Profil from '../Other Components/Profil';

import {CheckifBlocked} from './../../lib'


class LikesReceived extends Component {
	constructor() {
		 super()
		 this.state = {
			 pseudo: window.localStorage.pseudo, // Gets the pseudo of current user
			 loading: false, // Handles loading
			 user: [], // Will store the current user infos
			 error: false,  // Handles errors
			 blocked: [] // Handles the list of blocked users
		 }
		 this.Rerender = this.Rerender.bind(this)
	 }
	 
	 componentDidMount() { // Gets the list of usr who like the current user + the list of blocked user
		 const request = `http://localhost:8080/relation/like/likeuser/${this.state.pseudo}`
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
			  });
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

	 Rerender() { // Will handle the refresh if the looged user block someone
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

		let libraries = CheckifBlocked(this.state.user, this.state.blocked) // sort the list of user to show
		 const text = this.state.loading ? "loading..." : "Likes Received"
		 const UserProfil = libraries.map(item => <Profil key={item.pseudo} item={item}  Rerender={this.Rerender}/>)
		 return (
			 <div className="body">

				 { /* Title */}
				 <h1>{text}</h1>
				 {this.state.error ?
				 <h3 style={{marginTop: "100px", textAlign: "center", color: "#8E8E8E"}}>No user likes you</h3> :

				 /* List of users */
				 <Container className="table" >  
					 <Row className="justify-content-md-center" >
						 {UserProfil}
					 </Row>
				 </Container>
	 				}
			 </div>		
		 )
	 }
 }

export default LikesReceived
