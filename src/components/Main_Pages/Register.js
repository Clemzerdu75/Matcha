import React, { Component } from "react";
import { CSSTransition } from 'react-transition-group'
import axios from "axios";

import Welcome from './../Pieces_of_Pages/Register/Welcome'
import NameFields from './../Pieces_of_Pages/Register/NameFields'
import MailFields from './../Pieces_of_Pages/Register/MailFields'
import PasswordFields from './../Pieces_of_Pages/Register/PasswordFields'
import Confirmation from './../Pieces_of_Pages/Register/Confirmation'
import Success from './../Pieces_of_Pages/Register/Success'
import Failure from './../Pieces_of_Pages/Register/Failure'

class Register extends Component {
	constructor() {
		super()
		this.state= {
			Expand: false, // Handles the component state
			fieldValue: { // Stor all the data share by the user
				lastname: "",
				name: "",
				pseudo: "",
				password: "",
				email: "",
				gender: "",
				gallery: [],
				tagsModification: {
					newTags: [],
					deleteTags: []
				},
				sexOrientation: "bisexual"
			},
			step : 1, // Handles the step of registration
			errors: "", // Handles error text
			error: false // Handles error state
		}
		this.expand = this.expand.bind(this)
		this.nextStep = this.nextStep.bind(this)
		this.previousStep = this.previousStep.bind(this)
		this.submitRegistration = this.submitRegistration.bind(this)
		this.handleError = this.handleError.bind(this)
	}

	expand() { // Handles the state of the component
		this.setState(prevState => { return { Expand: !prevState.Expand } })
	}

	nextStep(infos) {  // Data management during all regitration.
		if(infos && infos !== "finished") { // Store the data provide by users and change the step of registration
			this.setState({
				step : this.state.step + 1,
				fieldValue: infos ? Object.assign(this.state.fieldValue, infos) : this.state.fieldValue,
				error: false
			  })
		}
		else  { // Resets all infos for new registration
			this.setState ({
				Expand: false,
				fieldValue: {
					lastname: "",
					name: "",
					pseudo: "",
					password: "",
					email: "",
					gender: "",
					gallery: [],
					tagsModification: {
						newTags: [],
						deleteTags: []
				},
				sexOrientation: "bisexual"
				},
				step : 1,
				errors: "",
				error: false
			})
		}

	}


	previousStep() { // For going back 
		this.setState({ step : this.state.step - 1, error: false })
	}
	
	submitRegistration() { // Handles the data sending to the server
		const infos = 	{	
							name: this.state.fieldValue.name,
							lastname: this.state.fieldValue.lastname,
							password: this.state.fieldValue.password,
							email: this.state.fieldValue.email,
							pseudo: this.state.fieldValue.pseudo,
							gallery: this.state.fieldValue.gallery,
							tagsModification: this.state.fieldValue.tagsModification,
							sexOrientation: this.state.fieldValue.sexOrientation,
							gender: this.state.fieldValue.gender
			}
		axios.post(`http://localhost:8080/newUser`, infos )
			.then((result) => {
				this.setState({ step: result.data  === 'success' ? 6 : 8 })
			})
			.catch(error => { this.setState({ step: 8 }) })
	}

	handleError() { this.setState({ error: true }) }

	showStep() { // Handle witch component to show during registration
		switch (this.state.step) {
		  case 1:
			return <Welcome nextStep={this.nextStep} />
		  case 2:
			return <NameFields  nextStep={this.nextStep}
								previousStep={this.previousStep} 
								handleError= {this.handleError}/>
		  case 3:
			return <MailFields 	nextStep={this.nextStep}
								previousStep={this.previousStep} 
								handleError= {this.handleError}/>
		  case 4:
			return <PasswordFields nextStep={this.nextStep}
									previousStep={this.previousStep} 
									handleError= {this.handleError} />
		  case 5:
			return <Confirmation	previousStep={this.previousStep}
									submitRegistration={this.submitRegistration} />
		  case 6:
			return <Success nextStep={this.nextStep} />
		  case 8 :
			return <Failure nextStep={this.nextStep}/>
		  default: {
				this.expand()
			}
		}
	  }
	
	render() {
		const Expand = this.state.Expand
		if(this.state.Expand) {
			return ( // Register Card
				<div>
					<div  style={{ position: "fixed", width: "100%", height: "100%", top: 0, backgroundColor: "rgb(0,0,0, 0.5"}} onClick={this.expand}></div>
					<CSSTransition
						in={Expand}
						appear={true}
						timeout={800}
						classNames="fade2" >
							{this.showStep()}
					</CSSTransition>
				</div>
			)
		} else {
			return ( // Register button 
				<div style={{position: "absolute", color: "white", zIndex: "20", right: "20%"}}>
					<h3  style={{color: "white", fontSize: "2em"}} onClick={this.expand}>Register</h3>
				</div>
			)
		}
	}
}

export default Register;
