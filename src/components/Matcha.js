import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import{  CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';

import Contact from './Main_Pages/Contact';
import Header from './Pieces_of_Pages/Header';
import History from './Main_Pages/History';
import Infos from './Main_Pages/Infos';
import Landing from './Main_Pages/Landing';
import LikesSend from './Main_Pages/LikesSend';
import LikesReceived from './Main_Pages/LikesReceived';
import NavBar from './Pieces_of_Pages/NavBar';
import Search from './Main_Pages/Search';
import Suggestions from './Main_Pages/Suggestions';
import Login from './Pieces_of_Pages/Login';
import Register from './Main_Pages/Register'
import socketContext from '../socketContext'
import Confirm from './Pieces_of_Pages/Confirm'
import EmptyPage from './Main_Pages/EmptyPage'
import PwdReset from './Pieces_of_Pages/PwdReset';



class Matcha extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: true, // handle loading
			isLogged: window.localStorage.pseudo ? true : false, // handle loging
			location: { // handle if you want to be located or not
        		activate: false,
      		},
     		newNotif: 0, // Handle notification
			expand: false, // Handle the state of the navbar
			isCompleted: false // Handle the state of your personnal profil (if you provide all the needed infos)
		}
		this.delog = this.delog.bind(this)
		this.navbarExpand = this.navbarExpand.bind(this)
		this.resetNewNotif = this.resetNewNotif.bind(this);
		this.isCompleted = this.isCompleted.bind(this);
	}

	delog() { // handle logOut
		window.localStorage.clear();
		this.setState({
			isLogged: false,
		})
		window.location.reload()
	}

	login = (dataFromChild) => { // handle logIn
		if(dataFromChild) {
			const pseudo = window.localStorage.pseudo
			const request = `http://localhost:8080/user/${pseudo}`
			this.setState({isLoading: true})
			axios.get(request)
				.then(response => response.data)
				.then(data => {
					this.setState({
			newNotif: data.newNotification === undefined ? 0 : data.newNotification,
			isCompleted: data.accountStatus === "completed" ? true: false,
			isLoading: false,
			isLogged: true,
					})
			})
			window.location.reload()
		}
	}

	navbarExpand() { //handle the state of the navbar (for mobile version)
		this.setState(prevState => {
			return {
				expand: !prevState.expand
 			}
		})
	}

  resetNewNotif = () => { // Reset the notification state
    this.setState({
      newNotif:0
    });
  }

  componentDidMount = () => { // Will see if you're connected + will handle the needed actions to make. 
    if(window.localStorage.token && window.localStorage.pseudo)
    {
      axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.token}`
      const pseudo = window.localStorage.pseudo
      const request = `http://localhost:8080/user/${pseudo}`
      this.setState({isLoading: true})
          axios.get(request)
            .then(response => response.data)
            .then(data => {
							if (data === 'Bad authentification') {
								this.delog();
							} else {
								console.log(data);
								this.setState({
									newNotif: data.newNotification === undefined ? 0 : data.newNotification,
									isCompleted: data.accountStatus === "completed" ? true: false,
									isLoading: false,
								})
							}
         		})
        		this.props.socket.on("receiveNotif", (from) => {
        		this.setState({
            	newNotif: this.state.newNotif + 1,
          	})
        })
    }
  }

  isCompleted(bool) { // Handle isCompleted state
	  this.setState({
		  isCompleted: bool,
	  })
  }

	render() {
    if (this.state.isLogged && this.state.isCompleted) { // You're logged and you're profil is completed
		  return (
		  	<Router>
		  		<Route render={ ({location}) =>  (
		  			<div>

						{/* Static component: Header + Navbar */}
						<Header
							triggerParentUpdate={this.delog}
							HandleNavbar={this.navbarExpand}
							expand={this.state.expand}
							newNotif = {this.state.newNotif}
							resetNewNotif = {this.resetNewNotif}/>
		  				<NavBar expand={this.state.expand} HandleNavbar={this.navbarExpand}/>

						{/* All Main pages of the website */}
		  				<TransitionGroup>
		  					<CSSTransition
		  						key= {location.key}
		  						timeout={300}
		  						classNames="fade">
		  						<Switch location={location}>
		  							<Route path="/" exact component={Suggestions}/>
		  							<Route path="/suggestions" component={Suggestions}/>
		  							<Route path="/Search" component={Search} />
		  							<Route path="/LikesSend" component={LikesSend} />
		  							<Route path="/LikesReceived" component={LikesReceived} />
		  							<Route path="/Infos" render={(props) => <Infos {...props} logOut={this.delog} isCompleted={this.isCompleted} />} />
		  							<Route path="/History" component={History} />
		  							<Route path="/Contact" component={Contact} />
									<Route path="/ResetPassword" component={PwdReset}/>
		  						</Switch>
		  					</CSSTransition>
		  				</TransitionGroup>
		  			</div>)} />
		  	</Router>

		  )
		} else if (this.state.isLogged && !this.state.isCompleted && !this.state.isLoading) { // You're logged but you didn't provide all the needed infos.
			return (
				<Router>
					<Route render={ ({location}) =>  (
						<div>

						{/* Static component: Header + Navbar */}
						<Header
							triggerParentUpdate={this.delog}
							HandleNavbar={this.navbarExpand}
							expand={this.state.expand}
							newNotif = {this.state.newNotif}
							resetNewNotif = {this.resetNewNotif}/>
							<NavBar expand={this.state.expand} HandleNavbar={this.navbarExpand}/>

							{/* All Main pages of the website */}
							<TransitionGroup>
								<CSSTransition
									key= {location.key}
									timeout={300}
									classNames="fade">
									<Switch location={location}>
										<Route path="/" exact  render={(props) => <Infos {...props} logOut={this.delog} isCompleted={this.isCompleted} />}/>
										<Route path="/suggestions" component={EmptyPage}/>
										<Route path="/Search" component={EmptyPage} />
										<Route path="/LikesSend" component={EmptyPage} />
										<Route path="/LikesReceived" component={EmptyPage} />
										<Route path="/Infos" render={(props) => <Infos {...props} logOut={this.delog}  isCompleted={this.isCompleted}/>} />
		  								<Route path="/History" component={EmptyPage} />
		  								<Route path="/Contact" component={EmptyPage} />
										<Route path="/ResetPassword" component={PwdReset}/>
									</Switch>
								</CSSTransition>
							</TransitionGroup>
						</div>)} />
				</Router>)

		} else { // You're not logged
			return (
					<Router>

						{/* Landing page background */}
						<Landing />
						<div className="landing_title" >
							<h3 style={{fontSize: "15vw", textAlign:"center", marginTop: "10%", color: "#FF1744", fontWeight: "900", opacity: ".8" }}>MATCHA</h3>
							<div style={{width: "100%", height: "10%"}}></div>

							{/* Athentification Components (for logIn and register + reset Password and confirm your email adress) */}
							<Login callbackFromParent={this.login}/>
							<Register />
              				<Route path="/ValidateAccount" component={Confirm}/>
							<Route path="/ResetPassword" component={PwdReset}/>
						</div>
					</Router>
			)
		}
	}
}

const MatchaSocket = props => (
  <socketContext.Consumer>
  {socket => <Matcha {...props} socket={socket} />}
  </socketContext.Consumer>
)

export default MatchaSocket;
