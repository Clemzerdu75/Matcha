import React, { Component } from 'react';
import { Transition } from 'react-transition-group'
import NotifButton  from './NotifButton'

class NotifList extends Component {
  constructor(props) {
		super(props)
		this.state = {
      expand: false,
      notifications: [],
      newNotif:this.props.newNotif
		}
  }

	render () { return(
    <Transition timeout={200} in={true} appear>
			{(status) => (
		<div className={this.props.use === "Chat" ? `activity2 activity2-${status}` : "activity" }  style={{marginLeft: this.props.use === "Chat" ? "280px" : 0}}>
			{this.props.use ?
			<h3 className="notif_expand_title">{this.props.use}</h3> :
      null}
        
				<ul style={{height: "320px", width: "280px", marginTop: "15px", paddingTop: this.props.use ? "50px" : "0", boxShadow: "none"}}>
          { (!Array.isArray(this.props.notifications)|| this.props.notifications === undefined || this.props.notifications.length === 0) ?
					<li>
						<div className="n_row"  style={{height: "auto"}}>
							<img style={{height: "75px", borderRadius: "5px"}}alt="" src="https://uinames.com/api/photos/male/11.jpg"></img>
							<div style={{marginLeft: "3%"}}>
								<h3 style={{ fontSize: "1.5em", marginBottom: "10px"}}> No notifs</h3>
								<h4><strong style={{fontWeight: "900"}}></strong> Use our website to get some </h4>
								<h4 style={{color: "#bfbfbf",}}> 4 hours ago</h4>
							</div>
						</div>
					</li>
          :
		  this.props.notifications.map((element, i) =>  {
			if(element &&  element.title.length)
            	return <NotifButton key={i} index = {i} newNotif = {this.props.newNotif} notification = {element}/>
			else
				return null
		  })
		  
          }
				</ul>
		</div>
			)}
		</Transition>

  )}
}


export default NotifList
