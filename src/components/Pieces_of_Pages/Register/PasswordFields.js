import React, { Component } from 'react'
import Arrow from './../../../img/logo/arrow.png';
import ArrowB from './../../../img/logo/arrowb.png';
import { checkPassword } from './../../../lib'

class PasswordFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: "",
            passwordConfirmation: "",
            error: ""
        }
        this.onChange = this.onChange.bind(this)
        this.nextStep = this.nextStep.bind(this)
    }
    
    onChange(e) {
        this.setState ( {[e.target.name]: e.target.value} )
    }

    nextStep() {
        if(this.state.password && this.state.passwordConfirmation) {
            const infos= { password: this.state.password}
        if(infos.password !== this.state.passwordConfirmation)
            this.setState( { error: "Please enter the same password in the fields" })
        else if(!checkPassword(infos.password))
            this.setState( {error: "Your password doesn't fit with our privacy politicy" })
        else
            this.props.nextStep(infos)
        } else 
            this.setState ( {error: "Please fill all the fields"} )
        
    }

    render() {
        return(
            <div className="subscription_card" style={{boxShadow: this.state.error ? "0px 2px 60px #FF1744" : null, transition: ".1s ease-out"}}>
                <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", color: this.state.error ? "#FF1744" : "#2F2F2F", transition: ".1s ease-out"}}>Security</h1>
                <h3 style={{marginLeft: "4%",  color: "grey", marginTop: "2%", width: "70%"}}> To protect your personnal information, choose a password<br/>
                It needs to have at least one capital letter, one digit and one special character</h3>
                <form style={{textAlign: "center", width: "100%", marginTop: "10%"}}>
                <input
					value={this.state.password}
					onChange = {this.onChange}
					type="password"
					name="password"
					className="simple_input"
					placeholder= "Password"/>
					<div style={{height: "50px", width: "100%"}}></div>
					<input
						value={this.state.passwordConfirmation}
						onChange = {this.onChange}
						type="password"
						name="passwordConfirmation"
						className="simple_input"
						placeholder= "Password Confirmation"/>
                    <button className="button" type="button"  style ={{backgroundColor: this.state.error ? "#FF1744" : "#45bf37", transition: ".1s ease-out"}} onClick={this.nextStep}><img alt="" src={Arrow}></img></button>
				</form>
                <button className="button" style={{left: "20px", backgroundColor: "transparent"}} onClick={this.props.previousStep}><img  alt="" src={ArrowB}></img></button>
              
                {this.state.error ? <h3 style={{ textAlign: "center",  color: "#FF1744", fontSize: "2em", transition: ".1s ease-out", marginTop: "1%", marginBottom: "1%"}}>{this.state.error}</h3> : null}
            </div>
        )
    }
      
}

export default PasswordFields