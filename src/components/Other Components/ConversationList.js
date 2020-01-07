import React, { Component } from 'react';
import ConversationButton from './ConversationButton';
import { Container } from 'reactstrap'


class ConversationList extends Component {
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo
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
        console.log(conv[0].time)
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
						sortConversation='hola' /*{this.sortConversation}*/
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
