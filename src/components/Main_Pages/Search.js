import React, { Component } from 'react';
import Profil from '../Other Components/Profil';
import { Container, Row} from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import Filter from '../Other Components/Filter';
import Order from './../Other Components/Order'
import { globalSort } from './../../lib';
import axios from 'axios';


class Search extends Component {
	_isMounted = false;
	constructor() {
        super()
        this.state = {
			pseudo: window.localStorage.pseudo,
			logged_user: {},
			loading: false,
			search: "",
			user: [],
			showFilter: false,
			order: "auto",
			filter: { female: true, male: true},
			isMobile: window.innerWidth <= 640 ? true : false,
			blocked: []
        }
		this.handleChange = this.handleChange.bind(this)
		this.showFilter = this.showFilter.bind(this)
		this.handleOrder = this.handleOrder.bind(this)
		this.handleFilter = this.handleFilter.bind(this)
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
				let prev_blocked =  this.state.blocked.length ? this.state.blocked.concat(data) : data
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

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
           [name]: value
		})
	}
	
	showFilter() {
		this.setState(prevState => {
			return {
				showFilter: !prevState.showFilter
 			}
		})	
	}

	Rerender() {
		this.setState({ state: this.state });
	}

	handleFilter(filter_object) { this.setState({filter: filter_object}) }

	handleOrder(order_type) { this.setState({ order: order_type }) }

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
				<h1>{text}</h1>
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
					<h3 onClick={this.showFilter}  style={{textAlign: "left", marginLeft: "10%"}}>{this.state.showFilter? "Less" : "More"}</h3>
				</div>
		
				{searchString.length > 0 ? 
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
