import React, {Component} from "react"
import axios from "axios"
import Geocode from "react-geocode";
import moment from "moment"

import Map from "./../Other Components/Map"
import SimpleCard from './../Other Components/SimpleCard'
import PictureInfos from './../Other Components/Picture_infos'
import TableTags from '../Other Components/Tags_table'
import tags from './../../img/tag_data'
import Blank from'./../../img/logo/upload_blank.jpg'
import Glass from './../../img/logo/loupe.png'
import { checkNames, checkMail, checkPseudo, checkDate } from "../../lib";


class Infos extends Component {
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			user: { pseudo: "",
					name: "",
					lastname: "",
					email: "",
					description: "",
					birthday: "2015-01-01",
				},
			profil: false,
			tags: [],
			apply: 3,
			isMobile: window.innerWidth <= 640 ? true : false,
			error: "",
			completed: 0,
			wanted_location: ""
		}
		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
		this.showProfil = this.showProfil.bind(this)
		this.handleTags = this.handleTags.bind(this)
		this.updateGalleryState = this.updateGalleryState.bind(this)
		this.handleDeletedPic = this.handleDeletedPic.bind(this)
		this.deleteProfil = this.deleteProfil.bind(this)
		this.getFullLocInfos = this.getFullLocInfos.bind(this)
		window.addEventListener("resize", this.update)
		this.feedbackOff = this.feedbackOff.bind(this)
		this.resetPassword = this.resetPassword.bind(this)
	}


	resetPassword = () =>{
		axios.put('http://localhost:8080/resetPassword', {email: this.state.user.email})
	}


	componentDidMount() {
		this._isMounted = true;
		const pseudo = window.localStorage.pseudo
		const request = `http://localhost:8080/user/${pseudo}`

		this.setState({ loading: true })
		axios.get(request)
			.then(response => response.data)
            .then(data => {
							data.birthday = data.birthday === " " ? this.state.user.birthday : data.birthday
                this.setState({
                    loading: false,
					user: data,
				})
			})
			.then( () => {
				let tag_list = this.state.user.tags
				console.log(this.state.user.birthday)
				this.setState(prevState => ({
					tags: tag_list,
					user: {
						...prevState.user,
						birthday: this.state.user.birthday === " " ? "2015-01-01" : this.state.user.birthday,
						Oldpseudo: pseudo,
						tagsModification: {
								newTags: [],
								deleteTags: []
						},
						deletedPic: [],
						completed: 0,
						wanted_location: "",
					},
				}))
				console.log(this.state.user.birthday)
			})
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
	

	update = () => {
		if(this._isMounted)
			this.setState({isMobile: window.innerWidth <= 640 ? true : false})
	}

	onSubmit() {
		const user = this.state.user;
		const header = '"Access-Control-Allow-Origin": "*"'
		if(user.birthday.length > 0 ) {
			let splitted = user.birthday.split('-')
			if(splitted[0].length === 4) {
				var filtered = splitted.filter(function(el) {
					return el !== ""
				});
				[filtered[0], filtered[2]] = [filtered[2], filtered[0]]
				user.birthday = filtered.join('-')
			}
			
    }
		if(user.name.length > 0 && user.pseudo.length > 0 && user.lastname.length > 0 && user.email.length > 0
			&& user.description.length > 0 && moment(user.birthday, 'DD-MM-YYYY').isValid() && (user.tagsModification.length > 0 || user.tags.length > 0 ) && user.gallery.length > 0) {
        user.completed = 1
        
			}
		else
			user.completed = 0
		if(!checkNames(user.name))
			this.setState({ error: "Your name can only contain letter"})
		else if (!checkNames(user.lastname))
			this.setState({error: "Your lastname can only contain letter"})
		else if (!checkMail(user.email))
			this.setState({error: "Your mail is not valid"})
		else if (!checkPseudo(user.pseudo))
			this.setState({error: "Your pseudo is not valid"})
		else if(!checkDate(user.birthday))
			this.setState({error: "Birthdate is not valid"})
		else if(user.description.length > 500)
			this.setState({error: "Your description can have 500 character max."})
		else {
			this.props.isCompleted(user.completed)
			axios.put(`http://localhost:8080/user/modify`, { headers: header, data:  user })
			.then( result => {
				if(result.data === 'failure') {
					this.setState({ apply: 2 })
				} else {
					window.localStorage.pseudo = this.state.user.pseudo
					this.setState({ apply: 1 }) 
				}
			})
			.catch(error => {this.setState({ apply : 0 }) })
		}
	}

	onChange(e) {
		const {name, value} = e.target
		if(name === "wanted_location") {
			this.setState({
				wanted_location: value
			})
		} else {
			this.setState(prevState => ({
				user: {
					...prevState.user,
					[name]: value
				}
			}))
		}
		
	}
	
	showProfil() {
		this.setState((prevState) => { return {profil: !prevState.profil} })
	}

	handleTags(tags_list, tagsModif) {
		let	Nnew = this.state.user.tagsModification.newTags
		let Ndelete = this.state.user.tagsModification.deleteTags

		if(tagsModif.new.length > 0) 
			Nnew.unshift(tagsModif.new)
		if (tagsModif.delete.length > 0) 
			Ndelete.unshift(tagsModif.delete)
		this.setState( prevState => ({
			tags: tags_list,
			user: {
					...prevState.user,
					tagsModification: {
						newTags: Nnew,
						deleteTags: Ndelete
					}
			}
		}))
	}

	updateGalleryState(newGallery) {
		this.setState((prevState) => ({
			user: {
				...prevState.user,
				gallery: newGallery
			}
		}))
	}

	handleDeletedPic(s_url) {
		let deleted_url = []
		if (this.state.deletedPic) {
			let deleted_url =  this.state.deletedPic
			deleted_url.push(s_url)
		}
		else {
			deleted_url = s_url
		}
		this.setState((prevState) => ({
			user:{
				...prevState.user,
				deletedPic: deleted_url
			}
		}))
	}

	deleteProfil() {
		axios.delete(`http://localhost:8080/user/delete`,  {data: {pseudo: this.state.user.Oldpseudo}})
		.then((result) => console.log(result))
		.then(() => {
			setTimeout(() => this.props.logOut(), 10000) 
		})
		.catch(e => console.log(e));
		
	}

	getFullLocInfos() {
		Geocode.setApiKey("AIzaSyCjmNYM7MuRfmbw-bDqOTZugSdMfQwZHxY");
		Geocode.setLanguage("fr");
		Geocode.fromAddress(this.state.wanted_location)
			.then( response => {
				let loc_google_response = response.results[0].geometry.location
				this.setState((prevState) => ({
					user: {
						...prevState.user,
						lat: loc_google_response.lat,
						lon: loc_google_response.lng
					}
				}))
				})
			.catch(error => {
				this.setState({
					wanted_location: ""
				})
			})
}

	feedbackOff() { this.setState({ apply: 3, error: ""}) }

	render() {
		let ProfilP = ""
		let date = this.state.user.birthday
		const text = this.state.loading ? "loading..." : "Informations"
		let feedback = ""
		let user_loc = this.state.user.lat > 0 ? { lat: parseFloat(this.state.user.lat), lng: parseFloat(this.state.user.lon) } : {lat : 0, lng: 0}

		if(date && date.length) {
			let splitted = date.split('-')
			if(splitted[0].length === 2) {
				var filtered = splitted.filter(function(el) {
					return el !== ""
				});
				[filtered[0], filtered[2]] = [filtered[2], filtered[0]]
				date = filtered.join('-')
			}
		}
		if(this.state.user.gallery && this.state.user.gallery.length) {
		 	ProfilP = this.state.user.gallery[0].length ? this.state.user.gallery[0] : this.state.user.gallery[1]
		} else {
			ProfilP = Blank;
		}

		if (this.state.apply === 2)
			feedback = "Username or email already taken 👎"
		if (this.state.apply === 1)
			feedback = "Your changes have been uploaded 👍"
		if(this.state.apply === 0)
			feedback = "Some shit happens ... 👎"
		return (
			
			<div className="body" style={{overflowX: "hidden" }}>
				{ this.state.profil ?
					<div>
						<div className="clickable_area"  onClick={this.showProfil}></div>
						<SimpleCard
							name={this.state.user.name}
							age={this.state.user.age}
							pseudo={this.state.user.pseudo}
							img={this.state.user.gallery}
							gender= {this.state.user.gender}
							bio={this.state.user.description}
							ori={this.state.user.orientation}
							tags ={this.state.user.tags}
							popularity={this.state.user.popularity}
							isInfo={"activated"}/>
					</div>
				: null }
				{this.state.apply !==  3 ? 
					<div>
						<div className="clickable_area"  onClick={this.feedbackOff}></div>
						<div className="card" style={{backgroundColor: this.state.apply !== 1 ? "#c4001d" : "#45bf37", padding: "50px 50px"}} onClick={this.feedbackOff}><h2 style={{color:this.state.apply !== 1 ? "black" : "white"}}>{feedback}</h2></div>
					</div> : null }
				{this.state.error.length ? 
					<div>
						<div className="clickable_area" onClick={this.feedbackOff}></div>
						<div className="card" style={{backgroundColor:"#c4001d", color: "black", padding: "50px 50px"}} onClick={this.feedbackOff}><h2>{this.state.error}</h2></div> 
					</div> : null }
				<h1>{text}</h1>
					<h2 style={{fontSize: "2em", color: "#FF1744"}}>Warning ! In this page you need to save your changes!</h2>
					<div className="infos_fields">
						<div className="infos_row">

							{/* - First Row - */}
							<div className="filter_col" >
							<h3>Pseudo</h3>
							<input
								value={this.state.user.pseudo}
								onChange = {this.onChange}
								type="text"
								name="pseudo"
								placeholder= ""/>
							<h3>Name</h3>
							<input
								value={this.state.user.name}
								onChange = {this.onChange}
								type="text"
								name="name"
								placeholder= ""/>
							<h3>Last Name</h3>
							<input
								value={this.state.user.lastname}
								onChange = {this.onChange}
								type="text"
								name="lastname"
								placeholder= ""/>
							<h3>Email</h3>
							<input
								value={this.state.user.email}
								onChange = {this.onChange}
								type="text"
								name="email"
								placeholder= ""/>
								<br/>
							</div>

							{/* - Second Row - */}
							<PictureInfos 
								ProfilPicture={ ProfilP }
								gallery={ this.state.user.gallery }
								pseudo={this.state.user.Oldpseudo}
								onSubmit= {this.updateGalleryState}
								onDelete= {this.handleDeletedPic}/>
							</div>
				</div>


					{/* -- Second Line -- */}

							<div className="infos_fields" style={{marginBottom: "175px"}}>
								<div className="infos_row" style={{width: "100%"}}>
								
								{/* - Third Row - */}
								<div className="filter_col" style={{marginTop: this.state.isMobile ? "0" : "-400px"}}>
									<h3>Description</h3>
									<textarea
										style={{resize: "none"}}
										value={this.state.user.description}
										onChange = {this.onChange}
										type="text"
										name="description"
										placeholder= ""/>

									<h3 style={{marginBottom: "6px"}}>Orientation</h3>
										<select multiple name="orientation" onChange={this.onChange} style={{marginLeft: "20%"}}> 
											<option selected={this.state.user.orientation === "heterosexual" ? "selected" : null } value="heterosexual" >Straight&nbsp;&nbsp;</option>
											<option  selected={this.state.user.orientation === "bisexual" ? "selected" : null } value="bisexual" >Bi&nbsp;&nbsp;</option>
											<option selected={this.state.user.orientation === "homosexual" ? "selected" : null } value="homosexual" >Gay</option>
										</select>

									<h3 style={{marginTop: "11px"}}>Birthday</h3>
									<input
										value={date}
										style={{width: "100%", textAlign: "center", fontSize: "2em", fontFamily: 'Helvetica Neue, sans-serif', paddingLeft: "10%", backgroundColor: "transparent", boxShadow: "none", letterSpacing: "3px", fontWeight: "bold"}}
										onChange = {this.onChange}
                   						type="date"
										data-date-format="DD/MMMM/YYYY"
                    					name="birthday"
                    					placeholder="dd-mm-yyyy"/>

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
														placeholder="" />
												</div>
											</div>
										</div>
									</div>
									<Map user_location={user_loc}/>
								</div>

					{/* --- Fourth Row --- */}
					<div className="filter_col" style={{ padding: "10px 10px", backgroundColor: "white", borderRadius: "10px", height: "auto", boxShadow: "0px 3px 8px rgb(0,0,0, .1)", marginTop: this.state.isMobile ? null : "-250px"}}>
						<h3>Tags</h3>
						<TableTags tags={tags} user_tags={this.state.tags} Submit={this.handleTags} />
					</div>
			</div>
						<div style={{width: this.props.isMobile ? "95%" : "30%", marginTop: this.props.isMobile ? "20px" :  "-38px", marginLeft: "3%"}}>
				</div>
				</div>


					{/* --- Bottom Line --- */}
					<div className="Modification_button">
						<button style={{backgroundColor: "#4fb827", color: "white", fontWeight: "bold", padding: "20px 10px"}} onClick={this.onSubmit}>Save</button>
						<div style={{display: "inline-block" ,width: "20px"}}></div>
						<button style={{backgroundColor: "transparent", color: "#53a3c2",  boxShadow: "inset 0px 0px 0px 3px #53a3c2" }} onClick={this.showProfil}>Preview</button>
						<div style={{display: "inline-block" ,width: "20px"}}></div>
						<button style={{backgroundColor: "transparent", color: "#8E8E8E",  boxShadow: "none", padding: "0" }} onClick={this.resetPassword}>Reset Password</button>
						<div style={{display: "inline-block" ,width: "20px"}}></div>
						<button style={{backgroundColor: "transparent", color: "#c4001d",  boxShadow: "none", padding: "0" }} onClick={this.deleteProfil}>Delete Account</button>
					</div>
				</div>
		)
	}
}

export default Infos
