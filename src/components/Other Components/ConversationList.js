import React, { Component } from 'react';
import ConversationButton from './ConversationButton';
import { Container } from 'reactstrap'


class ConversationList extends Component { // List of all the current user conversations
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo // Gets the current user pseudo
		}
		this.sortConversation = this.sortConversation.bind(this);
	}

	sortConversation = (newConv) => {
    const sortedConv = this.state.sortedConversation;
    if (this.state.sortedConversation.length === 0) {
      sortedConv.push(newConv);
    } else if (newConv.length === 0) {
      sortedConv.unshift(newConv);
    } else {
      sortedConv.forEach((conv, i) => {
      });
    }
  }

	render() {
		return(
			<Container className="conversationWrap">
          { Array.isArray(this.props.matches) ?
					this.props.matches.map((contact, i) =>
					<ConversationButton 
						changeConversation={() => this.props.changeConversation(i)}
						sortConversation='hola'
						key={'conversation_' + i}
						contact = {contact}
						coucou='coucou'	
						pseudo = {this.pseudo}/>			
					)
					: <h3> No conversation yet ! <br/> Go match dude </h3>
					}
			</Container>
		)
	}
}

export default ConversationList
