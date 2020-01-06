import React, { Component } from 'react'
import Arrow from './../../../img/logo/arrow.png';
import ArrowB from './../../../img/logo/arrowb.png';
import { checkMail } from './../../../lib'
import axios from 'axios';

class MailFields extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mail: "",
            mailConfirmation: "",
            user_email: []
        }
        this.onChange = this.onChange.bind(this)
        this.nextStep = this.nextStep.bind(this)
    }
    
    componentDidMount() {
        axios.get("http://localhost:8080/user/mail/all")
			.then(response => response.data)
            .then(data => {
                this.setState({
					user_email: data,
				})
            })
          
    }

    onChange(e) {
        this.setState ( {[e.target.name]: e.target.value} )
    }

    nextStep() {
        if (this.state.mail && this.state.mailConfirmation) {
            const infos = { email: this.state.mail }
            if(infos.email !== this.state.mailConfirmation)
                this.setState( { error: "Please enter the same email adresses in the fields" })
            else if(!checkMail(infos.email))
                this.setState( {error: "Your email adress is not valid" })
            else if (this.state.user_email.includes(infos.email))
                this.setState({ error: "This email adress is already used" })
            else
                this.props.nextStep(infos)
        } else 
           this.setState( {error: "Please fill all the fields" })
    }

    render() {
        return(
            <div className="subscription_card" style={{boxShadow: this.state.error ? "0px 2px 60px #FF1744" : null, transition: ".1s ease-out"}}>
                <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%",  color: this.state.error ? "#FF1744" : "#2F2F2F", transition: ".1s ease-out"}}>To contact you</h1>
                <h3 style={{marginLeft: "4%", color: "grey", marginTop: "2%", width: "70%"}}> We need your email to send you some information <br/>and check if you re not fake</h3>
                <form style={{textAlign: "center", width: "100%", marginTop: "10%"}}>
                     <input
				        value={this.state.mail}
						onChange = {this.onChange}
						type="text"
						name="mail"
						className="simple_input" 
						placeholder= "Email"/>
					<div style={{height: "50px", width: "100%"}}></div>
                    <input
				        value={this.state.mailConfirmation}
						onChange = {this.onChange}
						type="text"
						name="mailConfirmation"
						className="simple_input" 
						placeholder= "Email Confirmation"/>
                    <button className="button" type="button"  style ={{backgroundColor: this.state.error ? "#FF1744" : "#45bf37", transition: ".1s ease-out"}} onClick={this.nextStep}><img  alt="" src={Arrow}></img></button>
                </form>
                <button className="button" style={{left: "20px", backgroundColor: "transparent"}} onClick={this.props.previousStep}><img  alt="" src={ArrowB}></img></button>
               
                {this.state.error ? <h3 style={{ textAlign: "center",  color: "#FF1744", fontSize: "2em", transition: ".1s ease-out", marginTop: "1%", marginBottom: "1%"}}>{this.state.error}</h3> : null}
            </div>
        )
    }
      
}

export default MailFields