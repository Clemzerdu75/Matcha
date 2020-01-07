import React, { Component } from 'react';
import axios from 'axios'

import MessageList from '../Other Components/MessageList'
import MessageArea from '../Other Components/MessageArea'


class History extends Component { // Handle the chat part of the website
	constructor(props) {
		super(props)
		this.state = {
      loading: false, // handle loading
      pseudo: window.localStorage.pseudo, // handle pseudo of connected user
      user: [], // will receive the user information
      matches: [], // will receive the match list
      currentConversation: [], // will store the message of the toggle conversation
      conversationIndex: 0, // Will store the index of the toggle conversation 
      sortedConversation: [], // Will store the sorted conversation
    }
    this.changeConversation = this.changeConversation.bind(this);
    this.updateConversation = this.updateConversation.bind(this);
  }

  componentDidMount() { // Gets all the infos needed to make the component works
		const pseudo = window.localStorage.pseudo 
		const request = `http://localhost:8080/user/${pseudo}`
    this.setState({loading: true})
		axios.get(request) // gets user infos
			.then(response => response.data)
      .then(userData => {
        this.setState({
          loading: false,
					user: userData,
				})
			})
    axios.get(`http://localhost:8080/relation/match/${pseudo}`) // gets the list of matched users
		.then(response => response.data)
      .then(matchData => { 
        this.setState({
          loading: false,
					matches: matchData,
        })
      })
      .then(() => {
        if (this.state.matches[0]) {
          //gets the last conversation to display it
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

  updateConversation = (newMessage) => { // Stores new message in the state
    const newConv = this.state.currentConversation;
    newConv.push(newMessage);
      this.setState({
        currentConversation: newConv,
      })
  }

  changeConversation = (conversationIndex) => { // handle the change of conversation by changing the index and getting the new one.
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

         /* ---- Chat  Area ---- */ 
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
