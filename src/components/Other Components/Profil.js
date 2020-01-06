import React, {Component} from "react";
import {Col} from "reactstrap";
import Card from './Card';
import { CSSTransition } from 'react-transition-group'
import socketContext from '../../socketContext'

class Profil extends Component {
	constructor(props) {
		super(props)
		this.state = {
      Expand: false,
      logged: false
		}
		this.ExpandCard = this.ExpandCard.bind(this)
	}

  componentDidupdate = () => {
    this.props.socket.emit('isLogged', this.props.pseudo);
    this.props.socket.on('logged', () => this.setState({
      logged: true,
    }))
  }

	ExpandCard(a) {
			this.setState(prevState => {
				return {Expand: !prevState.Expand}
			})
			if(a === "coucou") {
				this.props.Rerender()
			}
	}

	render() {
		let img = ""
		if(this.props.item.gallery && this.props.item.gallery.length) {
			img = this.props.item.gallery[0].length ? this.props.item.gallery[0] : this.props.item.gallery[1]
		}
		const Expand = this.state.Expand
		const user_case = {
			zindex: "-2",
			backgroundImage: "linear-gradient(0deg, rgba(0,0,0,.7) 0, rgba(0,0,0,0) 50%) , url(" + img + ")" ,
			backgroundSize: "cover",
			borderRadius: "5px",
			margin: "30px 15px 0px 15px",
			maxWidth: "300px",
			maxHeight: "300px",
			minWidth: "300px",
			minHeight: "300px",
			boxShadow: "0px 2px 10px rgb(0,0,0, .2)",
			backgroundRepeat: "no-repeat",
		}
		const user_case_hidden = {
			zIndex: "60",
			backgroundColor: "#f0f0f0",
			borderRadius: "5px",
			margin: "30px 15px 0px 15px",
			maxWidth: "300px",
			maxHeight: "300px",
			minWidth: "300px",
			minHeight: "300px",
		}

		if (this.state.Expand) {
			return (
				
					<Col style={user_case_hidden}>
						<div className="clickable_area"  onClick={this.ExpandCard}></div>
						<CSSTransition
							in={Expand}
							appear={true}
							timeout={600}
							classNames="fade" >
							<Card
                logged = {this.state.logged}
								name={this.props.item.name}
								age={this.props.item.age}
								pseudo={this.props.item.pseudo}
								img={this.props.item.gallery}
								gender= {this.props.item.gender}
								bio={this.props.item.description}
								ori={this.props.item.orientation}
								tags ={this.props.item.tags}
								popularity={this.props.item.popularity}
                				lastConnect={this.props.item.lastConnect}
								Expand={this.ExpandCard}/>
						 </CSSTransition>
					</Col>
				
			)
		} else {
			return (
				<Col style={user_case} onClick={this.state.Expand ? 0 : this.ExpandCard}>
					 <div className="information">
						<div className="P_row">
							<h2 style={{color: "white", fontSize:"2em"}}>{this.props.item.name}</h2>
							<p className="age" style={{color: "white", fontSize:"2em"}}>{this.props.item.age}</p>
						</div>
						<h2 className="subtitle" style={{marginTop: "-5px", color: "lightgrey", fontSize:"1.2em"}}>As "{this.props.item.pseudo}"</h2>
					</div>
				</Col>
			)
		}
	}
	
}

const ProfilSocket = props => (
	<socketContext.Consumer>
		{socket => <Profil {...props} socket={socket} />}
	</socketContext.Consumer>
)

export default ProfilSocket;
