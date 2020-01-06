import React, { Component } from 'react';

import Tag from './Tag'

class SimpleCard extends Component {
	constructor(props) {
		super(props)
		this.state ={
			pseudo: window.localStorage.pseudo,
		}
	}
  
	render() {
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
				<div className="Match_gif" style={{ display: this.state.match_anim ? "block" : "none" }}>
				</div>
				<div className="top_row">
					<h2>{this.props.name}</h2>
					<p className="age">{this.props.age}</p>
				</div>
				<h2 className="subtitle">as "{this.props.pseudo}"</h2>
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
				</div>
			</div>
		)
	}
}

export default SimpleCard
