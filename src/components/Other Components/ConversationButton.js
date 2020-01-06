import React, { Component } from 'react';
import axios from 'axios';

class ConversationButton extends Component {
	constructor(props) {
		super(props)
		this.state = {
      pseudo: window.localStorage.pseudo,
      conversation: [],
      empty: true,
      lastmessage: this.props.lastmessage
    }    
	}

  componentDidMount = () => {
    axios.get(`http://localhost:8080/relation/conversation/${this.state.pseudo}/${this.props.contact.pseudo}`)
    .then(response => response.data)
    .then((conversationData) => {
      let empty = true;
      if(conversationData !== []) {
        empty = false;
        this.setState({
          lastmessage: conversationData[0],
        })
      }
      this.setState({
        conversation: conversationData,
        empty: empty
      })
    })
  }
  
	render() {
		return(
      <div style={{ height: "80px", width: "100%", borderBottom: "1px solid rgba(0,0,0, .1)", marginTop: "10px" }} onClick={this.props.changeConversation}>
				<div className="H_row">
					<div><img style={{height: "65px", width: "65px", borderRadius: "5px", marginTop: "5px", marginLeft: "5%"}}alt="" src={this.props.contact.gallery[0]}></img></div>
					<div style={{marginLeft:"3%", marginTop: "5px"}}>
          <h3 style={{ fontSize: "1.5em", marginBottom: "3px"}}>{this.props.contact.pseudo}</h3>
						<p style={{ color: this.props.answered === false ? "#FF1744" : null, width: "80%", maxHeight: "24px", overflow: "hidden"}}>{this.props.lastmessage.message !== "" ? this.props.lastmessage.message: 'No messages yet'}</p>
						<br />
						<p style={{ color: this.props.answered === false ? "#ff616f" : null}}>{ this.state.empty === false && this.props.lastmessage ? this.props.lastmessage.time : 'Send the first one now !'}</p>
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationButton
