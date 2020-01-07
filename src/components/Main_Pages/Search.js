import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

import Profil from '../Other Components/Profil';
import Filter from '../Other Components/Filter';
import Order from './../Other Components/Order'

import { globalSort } from './../../lib';

class Search extends Component {
	_isMounted = false;
	constructor() {
        super()
        this.state = {
			pseudo: window.localStorage.pseudo, // Gets the logged user pseudo
			logged_user: {}, // Will get all logged user infos
			loading: false, // Handles loading
			search: "", // Handles the search field
			user: [], // Will get the user list
			showFilter: false, // Handles the filter state
			order: "auto", // Handles the order of the user profils
			filter: { female: true, male: true}, // Handles if user wants to see female and/or male (dispite of orientation)
			isMobile: window.innerWidth <= 640 ? true : false, // handles mobile version
			blocked: [] // List of blocked users
        }
		this.handleChange = this.handleChange.bind(this)
		this.showFilter = this.showFilter.bind(this)
		this.handleOrder = this.handleOrder.bind(this)
		this.handleFilter = this.handleFilter.bind(this)
		this.Rerender = this.Rerender.bind(this)
		window.addEventListener("resize", this.update)
    }

    componentDidMount() { // Gets all the logged user infos + the list of all user + the list of blocked user
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
				let prev_blocked =  this.state.blocked.length ? this.state.blocked.concat(data) : data
                this.setState({
                    loading: false,
					blocked: prev_blocked,
				})
			})
	}

	componentWillUnmount() { // Prevents some bugs
		this._isMounted = false;
	  }

	update = () => { // Switch to mobile / desktop version
		if(this._isMounted)
			this.setState({isMobile: window.innerWidth <= 640 ? true : false})
	}

    handleChange(event) { // Handle the search field text
        const {name, value} = event.target
        this.setState({
           [name]: value
		})
	}
	
	showFilter() { // Handles the state of the filter component
		this.setState(prevState => {
			return {
				showFilter: !prevState.showFilter
 			}
		})	
	}

	Rerender() { // handles rerender
		this.setState({ state: this.state });
	}

	handleFilter(filter_object) { this.setState({filter: filter_object}) } // Stores the filter wanted

	handleOrder(order_type) { this.setState({ order: order_type }) } // Handles the order wanted

	render() {
		let user_loc = { lat: parseFloat(this.state.logged_user.lat), lng: parseFloat(this.state.logged_user.lon) }
		let height = ""
		const text = this.state.loading ? "loading..." : "Search"
		let result_text = null
		let libraries = globalSort(this.state.user, this.state.filter, this.state.order, this.state.logged_user, this.state.blocked)
		let searchString = this.state.search.trim().toLowerCase();

		if(this.state.showFilter && !this.state.isMobile)
			height = "300px";	
		else if (this.state.showFilter && this.state.isMobile) 
			height = "870px";
		else
			height= "60px";

		// Handles search field to show result in real time
		if (searchString.length > 0) {
			libraries = libraries.filter(function(i) {
				if(!searchString.includes("\\") && !searchString.includes("*") && !searchString.includes("(") && !searchString.includes(")")
				&& !searchString.includes("?") && !searchString.includes("[") && !searchString.includes("]"))
					return i.pseudo.toLowerCase().match(searchString);
				else
					return null
			});
			if (libraries.length === 0)
				result_text = "No result."
			var UserProfil = libraries.map(item => <Profil key={item.pseudo} item={item} Rerender={this.Rerender}/>)
		}
		return (
			<div className="body">

				{/* Title */}
				<h1>{text}</h1>

				{/* Search + Filter input */}
				<div className="search_field" style={{height: height}}>
					<input className="search_input"
						style={{width:this.state.filter && !this.state.isMobile ? "45%" : "100%", borderRadius: "5px"}}
						type="text"
						value={this.state.search}
						name="search"
						placeholder="Who are you looking for?"
						onChange={this.handleChange}
					/>
					{this.state.showFilter ?
					<div>
						<Filter 
							onFilter={this.handleFilter}
							orientation={this.state.logged_user.orientation}
							gender={this.state.logged_user.gender}
							isMobile={this.state.isMobile}
							location={user_loc}/>
						 <Order
						 	onOrder={this.handleOrder}
						 	isMobile={this.state.isMobile}/>
						</div> : null}
				</div> 
				<div className="filter" style={{marginTop: 0}} >

					{/* Show - Don't show filter */}
					<h3 onClick={this.showFilter}  style={{textAlign: "left", marginLeft: "10%"}}>{this.state.showFilter? "Less" : "More"}</h3>
				</div>
		
				{searchString.length > 0 ? 

				/* List of profil */
					<Container className="table" >  
						<Row className="justify-content-md-center" >
							{UserProfil}
						</Row>
					</Container> : null}
				<h3 style={{textAlign: "center", color: "#8E8E8E"}}>{result_text}</h3>
			</div>
		)
	}
}

export default Search
