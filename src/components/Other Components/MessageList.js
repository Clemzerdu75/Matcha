import React, { Component } from 'react';
import ConversationButton from './ConversationButton';
import socketContext from '../../socketContext'
import axios from 'axios';


class MessageList extends Component {
	constructor(props) {
		super(props)
		this.state ={
      pseudo: window.localStorage.pseudo,
      sortedConversation: [],
      lastMessages: []
    }
    //this.sortConversation = this.sortConversation.bind(this);
  }

  componentDidMount = () => {
    this.props.socket.on('receivemesEvent', (message, from) => {
      let newSortedConv = [];
      this.state.sortedConversation.forEach((conversation) => {
        if(conversation.pseudo !== from) {
          newSortedConv.push(conversation)
        } else {
          const date = new Date(message.time).toUTCString();
          newSortedConv.push({
            message: message.message,
            time: date,
            initialIndex: conversation.initialIndex,
            contact: conversation.contact,
            pseudo: conversation.pseudo,
            answered: false
          })
        }
      });
      newSortedConv = newSortedConv.sort((a, b) => {
        return Date.parse(b.time) - Date.parse(a.time);
      });
      this.setState({
        sortedConversation: newSortedConv
      });
    })
    this.props.socket.on('messageSent', (message, to) => {
      let newSortedConv = [];
      this.state.sortedConversation.forEach((conversation) => {
        if(conversation.pseudo !== to) {
          newSortedConv.push(conversation)
        } else {
          const date = new Date(message.time).toUTCString();
          newSortedConv.push({
            message: message.message,
            time: date,
            initialIndex: conversation.initialIndex,
            contact: conversation.contact,
            pseudo: conversation.pseudo,
            answered: true
          })
        }
      });
      newSortedConv = newSortedConv.sort((a, b) => {
        return Date.parse(b.time) - Date.parse(a.time);
      });
      this.setState({
        sortedConversation: newSortedConv
      });
    })
  }
  
  componentDidUpdate = () => {
    if (this.props.matches.length !== 0 && this.state.sortedConversation.length === 0) {
      const promises = this.props.matches.map((match, i) => new Promise((resolve, reject) => {
        axios.get(`http://localhost:8080/relation/conversation/${this.state.pseudo}/${this.props.matches[i].pseudo}`)
        .then(response => response.data)
        .then((conversationData) => {
          const date = new Date().toUTCString();
          resolve({ 
              message: conversationData.length === 0 ? "" : conversationData[0].message,
              time: conversationData.length === 0 ? date : conversationData[0].time,
              initialIndex: i,
              contact: this.props.matches[i],
              pseudo: this.props.matches[i].pseudo,
              answered: (conversationData.length > 0 && conversationData[0].sender === this.props.matches[i].pseudo) ? false : true
            }
          )
        })
      }));
      Promise.all(promises)
      .then((result) => {
        const sortedConv = result.sort((a, b) => {
          return Date.parse(b.time) - Date.parse(a.time);
        });
        this.setState({
          sortedConversation: sortedConv
        });
      })
    }
  };

	render() {
		return(

      
			<div className="Contact_list">
          { Array.isArray(this.props.matches) && this.state.sortedConversation.length === this.props.matches.length ?
          this.state.sortedConversation.map((contact, i) =>
          <ConversationButton
            lastmessage = {this.state.sortedConversation[i]}
            changeConversation={() => this.props.changeConversation(contact.initialIndex)}
            sortConversation= {this.sortConversation}
            key={`conversation_${contact.initialIndex}`}
            contact = {contact.contact}
            pseudo = {this.state.pseudo}
            conversation = {this.state.allConversation}
            answered = {contact.answered}
            >
          </ConversationButton>)
          : <h3> No conversation yet ! <br/> Go match dude </h3>}
			</div>
		)
	}
}

const MessageListSocket = props => (
  <socketContext.Consumer>
  {socket => <MessageList {...props} socket={socket} />}
  </socketContext.Consumer>
)

export default MessageListSocket
