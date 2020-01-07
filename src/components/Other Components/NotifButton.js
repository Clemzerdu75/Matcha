import React, { Component }  from 'react';

class Notification extends Component {
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo
		}
	}


	render() {
    const newNotif = this.props.newNotif < this.props.index + 1
		return(
    <div className="notificationButton">
      <li>
				<div className="n_row"  style={{height: "auto"}}>
					<img style={{height: "75px", width: "75px", borderRadius: "5px"}}alt="" src={this.props.notification.photo}></img>
					<div style={{marginLeft: "3%"}}>
						<h3 style={{ fontSize: "1.5em", marginBottom: "5px"}}> {this.props.notification.title}</h3>
						<h4 style= {{color: newNotif ? null : "#FF1744"}}><strong style={{fontWeight: "900"}}>{this.props.notification.sender}</strong> {this.props.notification.message} </h4>
						<h4 style={{color:newNotif ? "lightgrey" : "#ff616f",}}>{this.props.notification.timeString}</h4>
          			 </div>
				</div>
			</li>
    </div>
		)
	}
}

export default Notification
