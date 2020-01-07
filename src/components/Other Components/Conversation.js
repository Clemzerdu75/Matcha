import React, { Component } from 'react';
import { Container } from 'reactstrap'
import axios from "axios";
import Message from './MessageArea'

class Conversation extends Component {
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo,
			value:''
		}
		
		this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}


	handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
		axios.put(`http://localhost:8080/relation/conversation/update`,{
				message : this.state.value,
				sender: window.localStorage.pseudo,
				dest: this.props.matches[this.props.conversationIndex].pseudo
		})
	}
	

	render() {
		return(
			<div>
			<Container className="conversationWrap">
          { this.props.currentConversation != null ?
            this.props.currentConversation.map((message, i) => <Message className="message" key={`message_${i}`} 
            message = {message.message}
            sender = {message.sender}
            time = {message.time}
						pseudo = {this.state.pseudo} ></Message>)
					: <h3> No conversation yet ! <br/> Go match dude </h3>
					}
			<label>
				Nom :
				<input type="text" value={this.state.value} onChange={this.handleChange} />
			</label>
			<input onClick={this.handleSubmit} type="submit" value="Envoyer" />
			</Container>
			
		</div>
		)
	}
}

export default Conversation
