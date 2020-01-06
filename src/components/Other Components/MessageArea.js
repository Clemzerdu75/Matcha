import React, { Component } from 'react';
import axios from 'axios'
import Plane from './../../img/logo/plane.png'
import {animateScroll} from 'react-scroll';
import socketContext from '../../socketContext'

class MessageArea extends Component {
	constructor(props) {
		super(props)
		this.state = {
      pseudo: window.localStorage.pseudo,
      newMessage: "",
      currentConversation: this.props.currentConversation,
    }
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();
    this.props.socket.on('receivemesEvent', (value, from) => {
      if(value.sender === this.props.contact.pseudo) {
        this.props.updateConversation(value)
      }
  });
}

  componentDidUpdate() {
    this.scrollToBottom();
  }

  checkMessage (message) {
    return (message.search(';\\%$') !== -1 || message.search('/&^') !== -1) ? 0 : 1;
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "MessList",
      duration: 0
    });
}

  onChange = (e) => {
    this.setState({newMessage: e.target.value})
  }

  addMessage = () => {
    if (/;\\%\$/.test(this.state.newMessage) || /\/&\^/.test(this.state.newMessage)) {
      this.setState({
        newMessage: ""
      });
    }
    else if (this.state.newMessage !== ""){
      axios.put('http://localhost:8080/relation/conversation/update', {
      sender: this.state.pseudo,
      dest: this.props.contact.pseudo,
      message : this.state.newMessage,
    })
    .then(() => {
      const newMessage = {
        message: this.state.newMessage,
        sender:this.state.pseudo,
        time: Date.now()
        }
        return newMessage
      })
      .then((newMessage) => {
        this.props.socket.emit('sendMessage', newMessage, this.props.contact.pseudo, this.state.pseudo)
        const body = {
          pseudo1 : this.state.pseudo,
          pseudo2 : this.props.pseudo,
          title : 'New Message',
          message : ' Just sent you a message !',
        }
        axios.put('http://localhost:8080/user/notification/add', body)
        .then(() => {
          this.props.socket.emit('sendNotif', {targetPseudo: this.props.contact.pseudo})
          this.setState({
            newMessage: ""
          });
          this.props.updateConversation(newMessage);
        })
      })
    }
  }

  render = () => {
  return ( /* --- Message Field ---- */

    <div id="MessList" style={{ position: "absolute",  height: "100%", width: "calc(100% - 300px)", left: "300px", bottom: 0, minWidth: "300px", backgroundColor: "rgb(255, 255, 255, 1)", overflowY: "scroll"}}>
      {/* --- Sending Message --- */}

      <div className="Sending_message">
        <input
						type="textarea"
						name="newMessage"
						className="Message_box" 
            placeholder= "Type your message here..."
            onChange = {this.onChange} 
            value = {this.state.newMessage}
            />
        <div className="Message_button">
          <img alt="" onClick={this.addMessage} style={{ width: "70%", marginLeft: "11%", marginTop: "14%" }} src={Plane}></img>
        </div>
      </div>
      {/* --- Message List --- */}
      <div  className="Mess_List">
        {/* - User Messages - */}
        {this.props.currentConversation && this.props.currentConversation.length > 0 ?
        this.props.currentConversation.map((message, i) => {
          return (
          <div style={{wordBreak:"break-all"}} className={message.sender === this.state.pseudo ? "U_mess" : "O_mess"} key={`message${i}`}>
            <p style={{color: "white", fontSize: ".9em"}}> {message.message}
            </p>
          </div>
        )
        }) : 'no Messages yet ! send the first one now !'}
      </div>
    </div >
    )  
  }
}

const MessageAreaSocket = props => (
  <socketContext.Consumer>
  {socket => <MessageArea {...props} socket={socket} />}
  </socketContext.Consumer>
)
export default MessageAreaSocket
