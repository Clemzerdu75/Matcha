import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state = {
			isMobile: window.innerWidth <= 640 ? true : false,
		}
		window.addEventListener("resize", this.update)
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	update = () => {
		if(this._isMounted)
			this.setState({isMobile: window.innerWidth <= 640 ? true : false})
	}

	render() {
		return (
			<ul  style={{marginLeft: this.state.isMobile && !this.props.expand ? "-300px" : null, transition: ".4s ease-out"  }}>
				<li><p className="navbar-title">Match</p> </li>
				<li><Link className="link" to="/Suggestions" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Suggestions</Link></li>
				<li><Link className="link" to="/Search" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Search</Link></li>
				<li><Link className="link" to="/LikesSend" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Likes send</Link></li>
				<li><Link className="link" to="/LikesReceived" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Likes received</Link></li>
				
				<li><p className="navbar-title">Profil</p> </li>
				<li><Link className="link" to="/Infos" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Informations</Link></li>
	
				<li><p className="navbar-title">Chat</p> </li>
				<li><Link className="link" to="/History" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>History</Link></li>
				<li><Link className="link" to="/Contact" onClick={this.state.isMobile ? this.props.HandleNavbar : null}>Contact</Link></li>
			  </ul>
		)
	}
	
} 

export default Navbar;
