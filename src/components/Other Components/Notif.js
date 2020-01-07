import React, {Component} from 'react'
import NotifList from './NotifList'
import Dashboard from './Dashboard'
import axios from 'axios'

class NotifCard extends Component { // Shows Notification
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state = {
		expand: false, // Handles the display 
		notifications: [], // Will get all the notification 
		newNotif:this.props.newNotif, // Will handle newNotif
		isMobile: window.innerWidth <= 640 ? true : false, // For mobile
		}
		this.handleChange = this.handleChange.bind(this)
		window.addEventListener("resize", this.update)
  }
  
  componentDidMount() { // Gets all the notification
		this._isMounted = true;
		axios.get(`http://localhost:8080/user/notification/${window.localStorage.pseudo}`)
    .then(response => response.data)
    .then(result =>  {
      this.setState({notifications: result})
    })
    .catch(e => {
      console.log(e);
    });
  }

  componentWillUnmount() { // Prevents some bugs 
	this._isMounted = false;
}

  update = () => { // Switch Mobile/ Desktop version
	if(this._isMounted)
		this.setState({isMobile: window.innerWidth <= 640 ? true : false})
}

	handleChange() { // handle expand
		this.setState(prevState => {
			return {
				expand: !prevState.expand
 			}
		})	
	}

	render() {
		const Message = this.state.notifications ?  this.state.notifications.map((element) => {
			if(element.title === "New Message")
				return element
			else
				return null
		})
		: null 
		const Activity = this.state.notifications ?  this.state.notifications.map(element => {
			if(element.title === "New Message")
				return null
			else 
				return element
		})  : null
		return (
			<div>
				{this.state.expand ?
					<div className="notif" style={{width: "840px"}}>
						
						{ /* Full Notif panel */}
						<h3 style={{marginLeft: "15px",  marginTop: "5px", fontSize: "1.8em"}}>Notifications</h3>
						<NotifList use="Activity" notifications={Activity} newNotif = {this.state.newNotif} />
						<NotifList use="Chat"  notifications={Message} newNotif = {this.state.newNotif}/>
						<Dashboard />
						{!this.state.isMobile ? 
							<h3 
								style={{position: "absolute", bottom: "2%", right: "2%",  fontSize: "1em"}} 
								onClick={this.handleChange}>{this.state.expand ? "Less" : "More"}
							</h3> : null}
					</div>
				:
					<div className="notif">

						{/* Little notif list */}
						<h3 style={{marginLeft: "15px", marginTop: "5px", fontSize: "1.8em"}}>Notifications</h3>
						<NotifList notifications = {this.state.notifications} newNotif = {this.state.newNotif}/>
						{!this.state.isMobile ? 
							<h3 
								style={{position: "absolute", bottom: "2%", right: "2%",  fontSize: "1em"}} 
								onClick={this.handleChange}>{this.state.expand ? "Less" : "More"}
							</h3> : null}
					</div>
				}
			</div>
		)
	}
}

export default NotifCard
