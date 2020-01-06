import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Notif from './../../img/logo/notif.png';
import Notifb from './../../img/logo/notifb.png';
import NotifCard from '../Other Components/Notif';
import LogOut from './../../img/logo/logout.png';
import Menu from './../../img/logo/menu.png'


class Header extends Component {
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state = {
			notif: false,
			isMobile: window.innerWidth <= 640 ? true : false,
      user: {},
      newNotif: this.props.newNotif,
		}
		this.showNotif = this.showNotif.bind(this)
    window.addEventListener("resize", this.update); 
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	showNotif() {
    if(this.state.notif === true) {
      this.props.resetNewNotif();
    }
		this.setState(prevState => {
			return {
				notif: !prevState.notif
       }
    })
   
	}

	update = () => {
		if(this._isMounted)
			this.setState({isMobile: window.innerWidth <= 640 ? true : false});
  }


	render() {
		const title = {
			zIndex: -30,
			display: "inline-block",
			margin: '0 auto',
			color: 'white',
			fontFamily: "'Helvetica Neue', 'Sergoe', sans-serif",
			fontWeight: 900,
			fontSize: '40px',
			marginLeft: '30px',
			marginTop: '3px',
		}
		return (
			<div className="header">
				<img className="menu_button" style={{display: this.state.isMobile ? "inline-block" : "none"}} src={Menu} alt="" onClick={this.props.HandleNavbar}></img>
				<Link to="/" onClick={this.props.expand ? this.props.HandleNavbar : null}> <p style={title}> Matcha </p></Link>
				<img style={{ width: "43px"}} className="links" alt="" src={LogOut} onClick={this.props.triggerParentUpdate}/>
				<img onClick={this.showNotif} style={{marginRight: "2%", zIndex: 60}} className="links" alt="" src={this.state.notif ? Notifb : Notif} />
				<div style={{ display: this.props.newNotif !== 0 ? "block" : "none",  position: "absolute", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#ed87eb", top: "20px", right: "calc(5% + 58px)", zIndex: "50",  boxShadow:"0px 2px 10px rgba(0,0,0, .5)"}}>
					<p style={{color: "white", marginTop: "53%", marginLeft: "50%", transform: "translate(-50%, -50%)", fontWeight: "bold", fontSize: "1em",}}>{this.props.newNotif}</p>
				</div>
				{this.state.notif ? <NotifCard newNotif = {this.props.newNotif}/> : null}
			</div>
		)
	}	

} 

export default Header;
