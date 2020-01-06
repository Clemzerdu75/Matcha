import React, {Component} from 'react'
import { Transition } from 'react-transition-group'

class Order extends Component {
	constructor() {
		super()
		this.state= {
			order: "auto",
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		const { value } = e.target
		this.setState({ order: value })
		this.props.onOrder(value)
	}

	render() {
		return (
			<Transition timeout={400} in={true} appear>
			{(status) => (
				<form className={`order_content order_content-${status}`}>
					<h3 style={{ marginLeft: "0", fontSize: "1em", marginBottom: "-15px"}}>Order by</h3>
						<br/>
						<input 
							className="input_order"
							type="radio"
							name="order"
							value="auto"
							checked = {this.state.order === "auto"}
							onChange= {this.handleChange}
						/> <p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px", color: this.state.order === "auto" ? "black" : null}}>Auto</p>
						<br/>
						<input
							className="input_order"
							type="radio"
							name="order"
							value="i_age"
							checked = {this.state.order === "i_age"}
							onChange= {this.handleChange}
						/> <p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px", color: this.state.order === "i_age" ? "black" : null}}>Increasing Age</p>
						<br/>
						<input
							className="input_order"
							type="radio"
							name="order"
							value="d_age"
							checked = {this.state.order === "d_age"}
							onChange= {this.handleChange}
						/> <p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px",color: this.state.order === "d_age" ? "black" : null}}>Decreasing Age</p>
						<br/>
						<input
							className="input_order"
						
							type="radio"
							name="order"
							value="popularity"
							checked = {this.state.order === "popularity"}
							onChange= {this.handleChange}
						/><p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px", color: this.state.order === "popularity" ? "black" : null}}> Popularity</p>
						<br/>
						<input
							className="input_order"
							type="radio"
							name="order"
							value="localisation"
							checked = {this.state.order === "localisation"}
							onChange= {this.handleChange}
						/> <p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px", color: this.state.order === "localisation" ? "black" : null}}>Localisation</p>
						<br/>
						<input
							className="input_order"
							type="radio"
							name="order"
							value="tag"
							checked = {this.state.order === "tag"}
							onChange= {this.handleChange}
						/><p style={{marginLeft: "15%", fontSize: this.props.isMobile ? ".6em" : ".8vw", marginTop: "16px", color: this.state.order === "tag" ? "black" : null}}> Common Tags</p>
				</form>
			)}
			</Transition>
		)}
}
export default Order
