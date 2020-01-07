import React, {Component} from "react";
import Profil from '../Other Components/Profil';
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import {CheckifBlocked} from './../../lib'
import axios from 'axios';

class LikesReceived extends Component {
	constructor() {
		 super()
		 this.state = {
			 pseudo: window.localStorage.pseudo,
			 loading: false,
			 user: [],
			 error: false,
			 blocked: []
		 }
		 this.Rerender = this.Rerender.bind(this)
	 }
	 
	 componentDidMount() {
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

	 Rerender() {
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

		let libraries = CheckifBlocked(this.state.user, this.state.blocked)
		 const text = this.state.loading ? "loading..." : "Likes Received"
		 const UserProfil = libraries.map(item => <Profil key={item.pseudo} item={item}  Rerender={this.Rerender}/>)
		 return (
			 <div className="body">
				 <h1>{text}</h1>
				 {this.state.error ?
				 <h3 style={{marginTop: "100px", textAlign: "center", color: "#8E8E8E"}}>No user likes you</h3> :
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
