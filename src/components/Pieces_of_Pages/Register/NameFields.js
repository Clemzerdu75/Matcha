import React, { Component } from 'react'
import Arrow from './../../../img/logo/arrow.png';
import ArrowB from './../../../img/logo/arrowb.png';
import { checkNames, checkPseudo } from './../../../lib'
import axios from 'axios';


class NameFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            lastname: "",
            pseudo: "",
            gender: "",
            error: ""
        }
        this.onChange = this.onChange.bind(this)
        this.nextStep = this.nextStep.bind(this)
    }

    componentDidMount() {
        axios.get("http://localhost:8080/user/pseudo/all")
			.then(response => response.data)
            .then(data => {
                this.setState({
					user_data: data,
				})
        	})
    }
    onChange(e) {
        this.setState ( { [e.target.name]: e.target.value } )
    }

    nextStep() {
        if(this.state.name && this.state.lastname && this.state.pseudo && this.state.gender) {
            const infos = {name: this.state.name, lastname: this.state.lastname, pseudo: this.state.pseudo, gender: this.state.gender}
            if (!checkNames(infos.name)) 
                this.setState( { error: "Your name can only contain letters" })
            else if (!checkNames(infos.lastname))
                this.setState( { error: "Your lastname can only contain letters" })
            else if (!checkPseudo(infos.pseudo))
                this.setState( { error: "Your pseudo can only contain simple letters and digits"})
            else if (this.state.user_data.includes(infos.pseudo))
                this.setState( {error: "Your pseudo is already used"})
            else
                this.props.nextStep(infos)
        } else
            this.setState ( {error: "Please fill all the fields"} )
        if(this.state.error)
            this.props.handleError()
    }

    render() {
        return(
            <div className="subscription_card" style={{boxShadow: this.state.error ? "0px 2px 60px #FF1744" : null, transition: ".1s ease-out"}}>
                <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", color: this.state.error ? "#FF1744" : "#2F2F2F", transition: ".2s ease-out" }}>Who are you?</h1>
                <h3 style={{marginLeft: "4%", color: "grey", marginTop: "2%", width: "70%"}}> First we need to know your name and you need to choose a pseudo!</h3>
                <form style={{textAlign: "center", width: "100%", marginTop: "10%"}}>
                    <input
				        value={this.state.name}
						onChange = {this.onChange}
						type="text"
						name="name"
						className="simple_input" 
						placeholder= "name"/>
					<div style={{height: "50px", width: "100%"}}></div>
                    <input
				        value={this.state.lastname}
						onChange = {this.onChange}
						type="text"
						name="lastname"
						className="simple_input" 
						placeholder= "Lastname"/>
					<div style={{height: "50px", width: "100%"}}></div>
                    <input
                        value={this.state.username}
                        onChange = {this.onChange}
                        type="text"
                        name="pseudo"
                        className="simple_input" 
                        placeholder= "Username"/>
                    <div className="gender_selection">
                        <label className="container" style={{color: this.state.gender === "male" ? "#7BBCDE" : "grey", transition: ".1s ease-out"}} >M
                            <input type="radio"
                                name="gender"
                                value="male"
                                checked = {this.state.gender === "male"}
                                onChange= {this.onChange} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container" style={{color: this.state.gender === "female" ? "#F58C8C" : "grey", transition: ".1s ease-out"}}>F
                            <input type="radio"
                                name="gender"
                                value="female"
                                checked = {this.state.gender === "female"}
                                onChange= {this.onChange} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <button className="button" type="button" style ={{backgroundColor: this.state.error ? "#FF1744" : "#45bf37", transition: ".1s ease-out"}} onClick={this.nextStep}><img  alt="" src={Arrow}></img></button>
				</form>
                <button className="button" style={{left: "20px", backgroundColor: "transparent"}} onClick={this.props.previousStep}><img  alt="" src={ArrowB}></img></button>
               
                {this.state.error ? <h3 style={{ textAlign: "center",  color: "#FF1744", fontSize: "2em", transition: ".1s ease-out", marginTop: "1%", marginBottom: "1%"}}>{this.state.error}</h3> : null}
            </div>
        )
    } 
}

export default NameFields