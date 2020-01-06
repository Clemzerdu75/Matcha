import React, {Component} from 'react'
import NotifList from './NotifList'
import Dashboard from './Dashboard'
import axios from 'axios'

class NotifCard extends Component {
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state = {
		expand: false,
		notifications: [],
		newNotif:this.props.newNotif,
		isMobile: window.innerWidth <= 640 ? true : false,
		}
		this.handleChange = this.handleChange.bind(this)
		window.addEventListener("resize", this.update)
  }
  
  componentDidMount() {
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

  componentWillUnmount() {
	this._isMounted = false;
}

  update = () => {
	if(this._isMounted)
		this.setState({isMobile: window.innerWidth <= 640 ? true : false})
}

	handleChange() {
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
