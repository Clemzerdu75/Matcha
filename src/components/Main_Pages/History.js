import React, { Component } from 'react';
import MessageList from '../Other Components/MessageList'
import MessageArea from '../Other Components/MessageArea'
import axios from 'axios'

class History extends Component {
	constructor(props) {
		super(props)
		this.state = {
      loading: false,
      pseudo: window.localStorage.pseudo,
      user: [],
      matches: [],
      currentConversation: [],
      conversationIndex: 0,
      sortedConversation: [],
    }
    this.changeConversation = this.changeConversation.bind(this);
    this.updateConversation = this.updateConversation.bind(this);
  }

  componentDidMount() {
		const pseudo = window.localStorage.pseudo
		const request = `http://localhost:8080/user/${pseudo}`
    this.setState({loading: true})
		axios.get(request)
			.then(response => response.data)
      .then(userData => {
        this.setState({
          loading: false,
					user: userData,
				})
			})
    axios.get(`http://localhost:8080/relation/match/${pseudo}`)
		.then(response => response.data)
      .then(matchData => {
        this.setState({
          loading: false,
					matches: matchData,
        })
      })
      .then(() => {
        if (this.state.matches[0]) {
          axios.get(`http://localhost:8080/relation/conversation/${pseudo}/${this.state.matches[0].pseudo}`)
          .then(response => response.data)
          .then((conversationData) => {
            this.setState({
              loading: false,
              currentConversation: conversationData.reverse(),
            })
          })
        }
      })	
  }

  updateConversation = (newMessage) => {
    const newConv = this.state.currentConversation;
    newConv.push(newMessage);
      this.setState({
        currentConversation: newConv,
      })
  }

  changeConversation = (conversationIndex) => {
    axios.get(`http://localhost:8080/relation/conversation/${window.localStorage.pseudo}/${this.state.matches[conversationIndex].pseudo}`)
    .then(response => response.data)
     .then((conversationData) => {
       this.setState({
         conversationIndex: conversationIndex,
         currentConversation: conversationData.reverse(),
       })
     })
  }
  
  render = () => {
	return (
		<div className="body">
				{ /* ---- Message List ---- */ }
        <MessageList
          matches = {this.state.matches}
          conversationIndex = {this.state.conversationIndex}
          changeConversation = {this.changeConversation}
          />
        { this.state.matches.length === 0 ? <p>You don't have any contact yet ! Go match dude ! ;P</p> :
        <MessageArea
          contact = {this.state.matches[this.state.conversationIndex]}
          conversationIndex = {this.state.conversationIndex}
          currentConversation = {this.state.currentConversation}
          updateConversation = {this.updateConversation}/>
        }

		</div>
	)}
}
export default History
