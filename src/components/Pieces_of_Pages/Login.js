import React, { Component } from 'react'
import axios from 'axios'
import { CSSTransition } from 'react-transition-group'
import Arrow from './../../img/logo/arrow.png'

class Login extends Component {
	constructor(props) {
    super(props)
		this.state = {
			login:'',
			password: '',
			email: '',
			error: false,
			location:{},
			expand: false,
			timestamp: "no timestamp yet",
			forgetPasswd: false,
    }
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.Expand = this.Expand.bind(this)
		this.forgetPasswd = this.forgetPasswd.bind(this);
		this.resetPasswd = this.resetPasswd.bind(this);
	}

	onChange(e) { this.setState ({[e.target.name]: e.target.value})	}

	Expand() {
		this.setState(prevState => {
			return  { expand: !prevState.expand }
		})
	}
	
	forgetPasswd = () => {
		this.setState(prevState => {
			return  { forgetPasswd: !prevState.forgetPasswd }
		})
	}

	resetPasswd = () => {
		axios.put('http://localhost:8080/resetPassword', {email: this.state.email})
		
	}
	onSubmit(e) {
		var logged = false

		e.preventDefault()
		axios.post(`http://localhost:8080/login`, this.state)
			.then((response) => {
				if (response.data.status !== 200){
					this.setState({
						error: true
				})
				} else {
					logged= true
					window.localStorage.setItem('pseudo', response.data.pseudo)
					window.localStorage.setItem('token', response.data.token)
					axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.token}`
					if (this.state.error !== true) {
						this.handleLocation()
						.then(() => {
							this.props.callbackFromParent(logged);
						})
					}	
					
				}
			})
			
			.catch(error => {
				this.setState({
					error: true
				})
			});
      
  }

handleLocation() {
    return new Promise((resolve , reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, (error) => {
				reject(error);
			}, {
				enableHighAccuracy: true,
				timeout: 5000,
			})
    })
    .then((r) => {
      const location = { 
			latitude: r.coords.latitude,
			longitude: r.coords.longitude,
		}
			return(location);
		})
		.then((location) => {
			axios.put(`http://localhost:8080/user/location/update`,{
				location : location,
				user: window.localStorage.pseudo,
			})
			.then((result) => console.log(result))
		})
    .catch((e) => {
			if (e.code === 1){ 
				axios.put(`http://localhost:8080/user/location/update`,{
					location : {},
					user: window.localStorage.pseudo,
				})
			}
			else { console.log(e) };
		});
	}
 
	render() {
		const Expand = this.state.Expand
		if (this.state.expand) {
			return (
				<div>
					<div  style={{ position: "fixed", width: "100%", height: "100%", top: 0, backgroundColor: "rgb(0,0,0, 0.5"}} onClick={this.Expand}></div>
					<CSSTransition
						in={Expand}
						appear={true}
						timeout={800}
						classNames="fade" >
							<div className="subscription_card" style={{boxShadow: this.state.error ? "0px 2px 60px #FF1744" : null}}>
							<h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", color: this.state.error ? "#FF1744" : "#2F2F2F"}}>{this.state.forgetPasswd === false ? "Sign-in" : "Reset Password"}</h1>
							<h3 style={{marginLeft: "4%", fontSize: "1.5em", color: "grey", marginTop: "2%"}}>{this.state.forgetPasswd === false ? "New to Matcha? You can register on the main page!" : "Give us your mail in order to change your password"}</h3>
								<form style={{ width: "100%", marginTop: "15%", textAlign: "center"}} onSubmit={this.state.forgetPasswd === false ? this.onSubmit : this.resetPasswd}>
								{this.state.forgetPasswd === false ? 
									<div className="login_form">
										<input
											value={this.state.username}
											onChange = {this.onChange}
											type="text"
											name="login"
											className="simple_input" 
											placeholder= "Email"/>
										<br />
										<br />
										<input
											value={this.state.password}
											onChange = {this.onChange}
											type="password"
											name="password"
											className="simple_input"
											placeholder= "Password"/>
										<h3 onClick = {this.forgetPasswd} style={{marginLeft: "50%", transform: "translateX(-50%)",fontSize: "1.5em", color: "rgba(0,0,0, .8)", marginTop: "50px"}}> Forgot your password?</h3>
									</div>
									:
									<div>
										<h3 style={{marginLeft: "50%", transform: "translateX(-50%)",fontSize: "1.5em", color: "rgba(0,0,0, .8)", marginTop: "50px"}}> Enter your email :</h3>
										<br/>
										<input
											value={this.state.email}
											onChange = {this.onChange}
											type="text"
											name="email"
											className="simple_input"
											placeholder= "Email"/>
											<h3 onClick = {this.forgetPasswd} style={{marginLeft: "50%", transform: "translateX(-50%)",fontSize: "1.5em", color: "rgba(0,0,0, .8)", marginTop: "50px"}}> Log in</h3>
									</div>
									}
									<button className="button" style ={{backgroundColor: this.state.error ? "#ff616f" : "#45bf37"}}><img alt="" src={Arrow}></img></button>
									{this.state.error ? <h3 style={{position: "absolute", bottom: "5%", left: "5%", color: "#FF1744", fontSize: "2em"}}>Invalid information</h3> : null}
								</form>
							</div>
					</CSSTransition>
				</div>
		)} else {
			return (
				<div style={{ position: "absolute", color: "white", zIndex: "20", left: "20%"}}>
					<h3  style={{color: "white", fontSize: "2em"}}onClick={this.Expand}>Sign-in</h3>
				</div>
			)
		}	
	}
}

export default Login 
