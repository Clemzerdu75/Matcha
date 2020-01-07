import React, {Component} from 'react'
import Map from "./Map"
import Glass from './../../img/logo/loupe.png'
import { Transition } from 'react-transition-group'
import Geocode from "react-geocode";

class Filter extends Component {
	constructor(props) {
		super(props);
		this.state= {
			male: false,
			female: false,
			pop_min: "1",
			pop_max: "999",
			pop_error: false,
			age_error: false,
			age_min: "18",
			age_max: "100",
			wanted_tag: "",
			tags_list: [],
			wanted_location: "",
			loc_google_response: {
				lat : 0,
				lng : 0
			},
			range: 7,
		}
		this.onChange = this.onChange.bind(this)
		this.getFullLocInfos = this.getFullLocInfos.bind(this)
		this.saveTags = this.saveTags.bind(this)
		this.deleteTags = this.deleteTags.bind(this)
	}

	parseInfos(e) {
		return new Promise((resolve, reject) =>{
			const {name, value, type, checked} = e.target
			if(name === "pop_min" || name === "pop_max")  {
				if(isNaN(value) || value.length > 3)
					this.setState({ pop_error: true})
				else {
					this.setState({ [name] : value, pop_error: false })
					if (name === "pop_max" && value.length >= 2 && Number(value) < Number(this.state.pop_min))
						this.setState({ [name] : this.state.pop_min, pop_error: false})
					else if (name === "pop_min"  && Number(this.state.pop_max) < Number(value)) 
						this.setState({ pop_max : value, pop_error: false })
				}
			}
			else if (name === "age_min" || name === "age_max") {
				if(isNaN(value) || value.length > 3 )
					this.setState({ age_error: true })
				else
					this.setState({ [name] : value, age_error: false })
				if (name === "age_max" && value.length >= 2 && Number(value) < Number(this.state.age_min))
					this.setState({ [name] : this.state.age_min, age_error: false})
				else if (name === "age_min"  && Number(this.state.age_max) < Number(value)) 
					this.setState({ age_max : value, age_error: false })
			} else {
				if (type === "checkbox" && this.props.orientation !== "bisexual")
					return
				else
					type === "checkbox" ? this.setState({ [name] : checked }) : this.setState({ [name] : value })
			}
			resolve();
		});
	}

	onChange(e) {
		if(e)
			this.parseInfos(e)
				.then(() => this.props.onFilter(this.state))
				.catch((err) => console.log(err));
		else 
			this.props.onFilter(this.state)
	}	
	
	componentDidMount() {
		if(this.props.orientation === "bisexual")
			this.setState({female: true, male: true})
		if((this.props.orientation === "heterosexual" && this.props.gender === "male") 
			|| (this.props.orientation === "homosexual" && this.props.gender === "female"))
			this.setState({female: true, male: false})
		if((this.props.orientation === "heterosexual" && this.props.gender === "frmale") 
			|| (this.props.orientation === "homosexual" && this.props.gender === "male"))
			this.setState({female: false, male: true})
	}

	getFullLocInfos() {
		Geocode.setApiKey("AIzaSyCjmNYM7MuRfmbw-bDqOTZugSdMfQwZHxY");
		Geocode.setLanguage("fr");
		Geocode.fromAddress(this.state.wanted_location)
			.then( response => {
				  this.setState( {
						loc_google_response: response.results[0].geometry.location,
					}) 
				})
			.then( () => {
				this.onChange()
			})
			.catch(error => {
				this.setState({ wanted_location: ""})
			})
	}

	saveTags(e) {
		if (e.key === 'Enter') {
			let	tags = this.state.tags_list
			tags.push(this.state.wanted_tag)
			this.setState({
				tag_list: tags,
				wanted_tag: ""
			})
			this.props.onFilter(this.state)
		}	
	}

	deleteTags() {
		this.setState({
			tags_list: [],
		})
		this.props.onFilter(this.state)
	}
	
	render() {
		const tags_list = this.state.tags_list

		const Tags = tags_list.length ? tags_list.map((item, i) => <p style={{fontSize: ".4em"}} key={i}>{item}&nbsp;</p>) : null
		return (
		<Transition timeout={400} in={true} appear>
			{(status) => (
		<div className={`filter_field filter_field-${status}`}>
			<div className="filter_global_row">
				<div style={{width: this.props.isMobile? "97%"  : "45%"}}>
					<div className="filter_row" >

				{/* ----  GENDER ----- */}

						<div className="filter_input_field">
							<h3 style={{fontSize: "1em", marginLeft: "5%", marginTop:"1%"}}>Gender</h3>
							<div className="gender_selection">
                        		<label className="container" style={{color: this.state.male ? "#7BBCDE" : "grey", transition: ".1s ease-out", fontSize: "2em"}} >M
                        		    <input type="checkbox"
											name="male"
											checked = {this.state.male}
											onChange= {this.onChange} />
                        		</label>
                        		<label className="container" style={{color: this.state.female ? "#F58C8C" : "grey", transition: ".1s ease-out", fontSize: "2em"}}>F
                        		    <input type="checkbox"
											name="female"
											checked = {this.state.female}
											onChange= {this.onChange} />
                        		</label>
                    		</div>
						</div>

				{/* ----  TAGS ----- */}

						<div className="filter_input_field" style={{backgroundColor: "rgb(0,0,0, .2)"}}>
							<h3 style={{fontSize: "1em", marginLeft: "5%", marginTop:"1%"}}>Tags</h3>
							<input className="search_input"
								style={{ width: "90%", height:"15px", backgroundColor: "white", borderRadius: "5px", marginTop: "10px", marginLeft: "5%", fontSize: "0.4em"}}
								type="text"
								value={this.state.wanted_tag}
								name="wanted_tag"
								placeholder="#whatyouwant"
								onChange={this.onChange}
								onKeyDown={this.saveTags}/>
							<div style={{backgroundColor: "white", width: "90%", height: "35px", marginLeft: "5%", borderRadius: "5px", marginTop: "7px", overflow: "hidden"}} onClick={this.deleteTags}>{Tags}</div>

						</div>
					</div>
					<div style={{width: this.props.isMobile? "97%"  : "100%"}}>
						<div className="filter_row">

				{/* ----  POPULARITY ----- */}

						<div className="filter_input_field" style={{backgroundColor: "var(--DarkGrey"}}>
							<h3 style={{fontSize: "1em", marginLeft: "5%", marginTop:"1%", color: this.state.pop_error ? "#FF1744" : "white"}}>Popularity</h3>
							<div style={{display: "flex", flexDirection: "row", width: "calc(10% + 120px)", margin: "0 auto"}}>
								<div style={{height: "50px", width: "90px",border: this.state.pop_error ? "solid 5px #FF1744"  : "solid 5px white", borderRadius:"10px", textAlign: "center", marginTop: "10px", marginRight: "5%", padding: "0px 5px 5px 5px"}}>
									<input
										value={this.state.pop_min}
										onChange = {this.onChange}
										type="text"
										name="pop_min"
										className= "filter_input"
										placeholder= "1"/>
								</div>
								<h3 style={{fontSize:"1em", color: this.state.pop_error ? "#FF1744" : "white", marginTop: "20px", fontWeight: "300", marginRight: "5%"}}>to</h3>
								<div style={{height: "50px", width: "90px", border: this.state.pop_error ? "solid 5px #FF1744"  : "solid 5px white", borderRadius:"10px", textAlign: "center", marginTop: "10px", padding: "0px 5px 5px 5px"}}>
									<input
											value={this.state.pop_max}
											onChange = {this.onChange}
											type="text"
											name="pop_max"
											className= "filter_input"
											placeholder= "999"/>
								</div>
							</div>
							<h3 style={{width: "100%", display: this.state.pop_error ? "block" : "none", fontSize: ".5em", color: "#FF1744", textAlign: "right"}}> Only digits (3 max.)</h3>
						</div>

				{/* --- AGE --- */}

						<div className="filter_input_field" >
							<h3 style={{fontSize: "1em", marginLeft: "5%", marginTop:"1%", color: this.state.age_error ? "#FF1744" : "black"}}>Age</h3>
							<div style={{display: "flex", flexDirection: "row", width: "calc(10% + 120px)", margin: "0 auto"}}>
								<div style={{height: "50px", width: "90px",border: this.state.age_error ? "solid 5px #FF1744"  : "solid 5px black", borderRadius:"10px", textAlign: "center", marginTop: "10px", marginRight: "5%", padding: "0px 5px 5px 5px"}}>
									<input
										value={this.state.age_min}
										onChange = {this.onChange}
										type="text"
										name="age_min"
										className= "filter_input"
										style={{color: "black"}}
										placeholder= "18"/>
								</div>
								<h3 style={{fontSize:"1em", color: this.state.age_error ? "#FF1744" : "black", marginTop: "20px", fontWeight: "300", marginRight: "5%"}}>to</h3>
								<div style={{height: "50px", width: "90px", border: this.state.age_error ? "solid 5px #FF1744"  : "solid 5px black", borderRadius:"10px", textAlign: "center", marginTop: "10px", padding: "0px 5px 5px 5px"}}>
									<input
										value={this.state.age_max}
										onChange = {this.onChange}
										type="text"
										name="age_max"
										className= "filter_input"
										style={{color: "black"}}
										placeholder= "100"/>
								</div>
							</div>
							<h3 style={{width: "100%", display: this.state.age_error ? "block" : "none", fontSize: ".5em", color: "#FF1744", textAlign: "right"}}> Only digits (3 max.)</h3>
						</div>
					</div>
					</div>
				</div>

				{/* --- LOCALISATION --- */}

				<div style={{width: this.props.isMobile ? "95%" : "30%", marginTop: this.props.isMobile ? "20px" :  "-38px", marginLeft: "3%"}}>
					<div className="localisation_row">
						<div style={{width: "80%"}}>
							<h3 style={{fontSize: "1em", marginBottom: "10px"}}>Localisation</h3>
							<div className="map_input" style={{ marginBottom: "10px"}}>
								<div style={{display: "flex", flexDirection:"row", alignItems: "flex-start"}}>
									<img alt="" src={Glass} style={{height: "20px", marginLeft: "1%", marginTop: "5px"}} onClick={this.getFullLocInfos}></img>
									<input 
										className="search_input"
										onChange = {this.onChange}
										style={{ width: "calc(100% - 25px)", height:"30px", backgroundColor: "transparent"}}
										type="text"
										value={this.state.wanted_location}
										name="wanted_location"
										placeholder=""/>
								</div>
							</div>
						</div>
						<div style={{textAlign: "center",  width: "20%"}}>
							<input 
								className="search_input"
								style={{ paddingLeft: "20px", height: "37px", fontWeight: "bold" }}
								onChange= {this.onChange}
								type="number"
								value={this.state.range}
								name="range"
								placeholder= "0" />
							<h3 style={{fontSize: "0.7em", fontWeight: "bold"}}>km</h3>
							<h3 style={{fontSize: "0.5em", }}>around</h3>
						</div>
					</div>
					<Map user_location={this.state.loc_google_response.lat > 0 ? this.state.loc_google_response : this.props.location}/>
				</div>
			</div>
		</div>
		)}
		</Transition>
		)
	}
}

export default Filter
