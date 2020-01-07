import React, { Component } from 'react';

import EmptyHeart from './../../img/logo/heart_empty.png';
import FullHeart from './../../img/logo/heart_full.png';
import UserHeart from './../../img/logo/heart_user.png';
import LikedHeart from './../../img/logo/heart_liked.png';
import Dot from './../../img/logo/3dot.png';
import Tag from './Tag'
import axios from 'axios'
import socketContext from '../../socketContext'

class Card extends Component {
	_isMounted = false;
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo,
			liked_by_user: false,
			user_liked: false,
			match_anim: false,
			lastConnect: this.props.lastConnect,
			blocked: [],
		}

		this.handleLike = this.handleLike.bind(this)
		this.expandBlock = this.expandBlock.bind(this)
		this.blockUser = this.blockUser.bind(this)
    this.reportUser = this.reportUser.bind(this)
	}
  
  componentDidMount = () => {
		this._isMounted = true;
		var userlike = []
		axios.post('http://localhost:8080/relation/view/new', {
			viewer: this.state.pseudo,
			viewed: this.props.pseudo,
			currentPopularity: this.props.popularity
		})
		axios.get(`http://localhost:8080/relation/like/userlike/${this.state.pseudo}`)
			.then(response => response.data)
            .then(data => {
				userlike = data
				if(userlike)
					userlike = userlike.filter((i) => {
						return i.pseudo.match(this.props.pseudo)
					})
				if(Array.isArray(userlike) && userlike.length)
         			this.setState({
						liked_by_user: true,
					})
      })
		axios.get(`http://localhost:8080/relation/like/likeuser/${this.state.pseudo}`)
			.then(response => response.data)
      		.then(data => {
				userlike = data
				if(userlike.length > 0)
					userlike = userlike.filter((i) => {
						return i.pseudo.match(this.props.pseudo)
					})
				if(Array.isArray(userlike) && userlike.length)
          			this.setState({
						user_liked: true,
            		})
          })
    const body = {
      pseudo1 : this.state.pseudo,
      pseudo2 : this.props.pseudo,
	}
		this.props.socket.emit('isLogged', this.props.pseudo);
		this.props.socket.once('logged', (answer) => {
			console.log(answer)
			if (answer === true) {
				console.log(this.state.checkIsLogged);
				this.setState({
				lastConnect:"Logged",
				checkIsLogged: true
				});
			}
		});

    axios.put('http://localhost:8080/user/notification/add', body, this.props.pseudo)
    .then((result) => {
     		this.props.socket.emit('sendNotif', {targetPseudo:this.props.pseudo})
    });
  }

  componentWillUnmount() {
	this.props.socket.off('isLogged');
	this.setState({
		checkIsLogged: true
	});
	this._isMounted = false;
}


	UpdateState() {
		return new Promise((resolve, reject) => {
			this.setState(prevState => {
				return { liked_by_user: !prevState.liked_by_user }
			})
			resolve();
		})
	}


	handleLike() {
		if(this._isMounted) {
			const request_body = { pseudo1: this.state.pseudo, pseudo2: this.props.pseudo }
			this.UpdateState()
				.then(() => {
					if(this.state.liked_by_user) {
						axios.post(`http://localhost:8080/relation/like/new`, request_body )
							.then(() => {
								this.props.socket.emit('sendNotif', {targetPseudo:this.props.pseudo})
							})
							.catch(error => {
								this.setState({
									error: true
								})
							});
					}
					if(!this.state.liked_by_user && !this.state.user_liked) {
						axios.delete(`http://localhost:8080/relation/like/delete`, {data: request_body})
							.catch(error => {
								this.setState({
									error: true
								})
							});
					}
					if(!this.state.liked_by_user && this.state.user_liked) {	
						axios.delete(`http://localhost:8080/relation/match/delete`, {data: request_body})
						.then(() => {
							this.props.socket.emit('sendNotif', {targetPseudo: this.props.pseudo})
						})
							.catch(error => {
								this.setState({
									error: true
								})
							});
					}
					if(this.state.liked_by_user && this.state.user_liked) {
						this.setState({match_anim: true})
						setTimeout(() => {
							this.setState({
								match_anim: false,
							})
						}, 800)
					}
				})
		}
	}

	expandBlock() {
		if(this._isMounted) {
			this.setState(prevState => {return { expandBlock: !prevState.expandBlock }})
		}
	}

	blockUser() {
		let pseudos = {pseudo1: this.state.pseudo, pseudo2: this.props.pseudo}
		axios.post(`http://localhost:8080/relation/block/new`, pseudos)
			.then((result) => { 
				let a = "coucou";
				this.props.Expand(a)
			 })
			.catch(error => { console.log(error) })
	}

	reportUser() {
		let pseudos = {pseudo1: this.state.pseudo, pseudo2: this.props.pseudo}
		axios.put(`http://localhost:8080/user/report`, pseudos)
		.then((result) => { 
			let a = "coucou";
			this.props.Expand(a)
		 })
		.catch(error => { console.log("b") })
	}

	generateBlock() {
		return (
			<div className="BlockCard" >
				<h3 style={{color: "#c4001d"}} onClick={this.blockUser}> Block</h3>
				<div style={{width: "100%", height: "15px"}}></div>
				<h3 style={{color: "#8E8E8E"}} onClick={this.reportUser}>Report</h3>
			</div>
		)
	}


	render() {
		var heart = EmptyHeart
		var text = null;
		let Block = this.state.expandBlock ? this.generateBlock() : null
		if (this.state.user_liked && this.state.liked_by_user)
			heart = FullHeart
		if(this.state.liked_by_user && !this.state.user_liked)
			heart = UserHeart
		if(this.state.user_liked && !this.state.liked_by_user)
			heart = LikedHeart
		const gender = this.props.gender === "female" ? "F" : "M"
		const UserTag = this.props.tags ? this.props.tags.map((item, i) => <Tag key={i} item={item}/>) : null
		var ori = ""
		ori = this.props.ori === "bisexual" ? "Bi" : ori
		ori = this.props.ori === "heterosexual" ? "Straight" : ori
		ori = this.props.ori === "homosexual" ? "Gay" : ori
		var color = ""
		if (ori === "Straight" && gender === "F")
			color = "#7BBCDE"
		if (ori === "Straight" && gender === "M")
			color = "#F58C8C"
		if (ori === "Gay" && gender === "M")
			color = "#7BBCDE"
		if (ori === "Gay" && gender === "F")
			color = "#F58C8C"
		return(		
			<div className="card">
				{Block}
				<div className="Match_gif" style={{ display: this.state.match_anim ? "block" : "none" }}>
				</div>
				<div className="top_row">
					<h2>{this.props.name}</h2>
					{text}
					<p className="age">{this.props.age}</p>
					<div className="right_row">
						<img alt="" className="heart" src={heart} onClick={this.handleLike} style={{display: this.props.img.length ? "block" : "none"}}></img>
						<img alt="" className="dot" src={Dot} onClick={ this.expandBlock }></img>
					</div>
				</div>
				<h2 className="subtitle">as "{this.props.pseudo}"</h2>
				<div style={{verticalAlign: "middle", marginTop: "5px", textAlign: "left"}}>
					<span className="status_dot" style={{backgroundColor: this.props.logged === true ? "#45bf37" : null, border: this.props.logged === true ? "none" : null}}></span>
					<p style={{margin: "0 auto", marginLeft: "0.7%"}}>{this.props.logged === true ? 'Logged' : this.state.lastConnect}</p>
				</div>
				<div className="picture">
					{this.props.img ? this.props.img.map((g, i) => {
						return <img key={i} className="Card_pic"  alt="" src={g}></img>
					}) : this.props.img}
				</div>
				<div className="gend_or">
					<h2 className="gender" style={gender === "F" ? {color: "#F58C8C"} : {color: "#7BBCDE"}}>{gender}</h2>
					{ori === "Bi" ? 
					<h2 className="ori"><strong style={{color: "#7BBCDE"}}>B</strong>i</h2>
					:
					<h2 className="ori" style={{color: color}}>{ori}</h2>
					}
				</div>
				<p className="bio">{this.props.bio}</p>
				<div className="tag_score">
					<div className="tag"> {UserTag} </div>
					<h2 className="score">{this.props.popularity}</h2>
				</div>
			
			</div>
		)
	}
}

const CardSocket = props => (
	<socketContext.Consumer>
		{socket => <Card {...props} socket={socket} />}
	</socketContext.Consumer>
)


export default CardSocket
