import React, { Component } from "react";
import Profil from '../Other Components/Profil';
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import { globalSort } from './../../lib';
import Order from './../Other Components/Order';
import Filter from '../Other Components/Filter';
import axios from 'axios';

class Suggestions extends Component {
	_isMounted = false;
   constructor() {
        super()
        this.state = {
			pseudo: window.localStorage.pseudo,
            loading: false,
			user: [],
			logged_user: {},
			order: "auto",
			showOrder: false,
			showFilter: false,
			filter: { female: true, male: true},
			isMobile: window.innerWidth <= 640 ? true : false,
			blocked: []
		}
		this.handleOrder = this.handleOrder.bind(this)
		this.handleFilter = this.handleFilter.bind(this)
		this.showOrder = this.showOrder.bind(this)
		this.showFilter = this.showFilter.bind(this)
		this.Rerender = this.Rerender.bind(this)
		window.addEventListener("resize", this.update)
    }
    
    componentDidMount() {
		this._isMounted = true;
		this.setState({loading: true})
		axios.get(`http://localhost:8080/user/${this.state.pseudo}`)
			.then(response => response.data)
            .then(data => {
                this.setState({
                    loading: false,
					logged_user: data,
				})
			})
		axios.get("http://localhost:8080/user/all")
			.then(response => response.data)
            .then(data => {
                this.setState({
                    loading: false,
					user: data,
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
				let prev_blocked = this.state.blocked.concat(data)
                this.setState({
                    loading: false,
					blocked: prev_blocked,
				})
			})
	}

	componentWillUnmount() {
		this._isMounted = false;
	  }

	update = () => {
		if(this._isMounted)
			this.setState({isMobile: window.innerWidth <= 640 ? true : false})
	}
	
	handleOrder(order_type) { this.setState({order: order_type}) }	

	handleFilter(filter_object) { this.setState({filter: filter_object}) }

	showOrder() {
		this.setState(prevState => {
			return{ showOrder: !prevState.showOrder }
		})
	}

	showFilter() {
		this.setState(prevState => {
			return{ showFilter: !prevState.showFilter }
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
		let height = ""
		let width = ""
		let user_loc = this.state.logged_user.lat && this.state.logged_user.lat > 0 ? { lat: parseFloat(this.state.logged_user.lat), lng: parseFloat(this.state.logged_user.lon) } : { lat: 48.896560, lon: 2.318420 }
		const text = this.state.loading ? "loading..." : "Suggestions"
		let result_text = null
		let libraries = globalSort(this.state.user, this.state.filter, this.state.order, this.state.logged_user, this.state.blocked)
		if(this.state.showFilter && !this.state.isMobile) {
			height = "300px";
			width = "80%";
		} else if (this.state.showFilter && this.state.isMobile) {
			height = "870px";
			width= "95%";
		} else {
			height= "70px";
			width= null;
		}
		if (libraries.length === 0)
		 	result_text = "No result."
		const UserProfil = libraries.map(item => <Profil key={item.pseudo} item={item} Rerender={this.Rerender} />)
		return (
			<div className="body">
				<h1>{text}</h1>
				<h3 style={{textAlign: "left", marginLeft: "10%", marginTop: "100px", zIndex: "50"}} onClick={this.showFilter}>Filter</h3>
				<div  className="suggestion_field" style={{height: height, width: width, paddingTop: "60px", opacity: this.state.showFilter ? "1" : "0", marginTop: "10px" }}> 
					{this.state.showFilter ? <div><Filter
					onFilter={this.handleFilter}
					orientation={this.state.logged_user.orientation}
					gender={this.state.logged_user.gender}
					isMobile={this.state.isMobile}
					location={user_loc}/> <Order onOrder={this.handleOrder} isMobile={this.state.isMobile}/> </div> : null }
				</div>
				<Container className="table" >  
					<Row className="justify-content-md-center" >
						{UserProfil}
					</Row>
				</Container>
				<h3 style={{textAlign: "center", color: "#8E8E8E"}}>{result_text}</h3>
			</div>		
		)
	}
}

export default Suggestions
