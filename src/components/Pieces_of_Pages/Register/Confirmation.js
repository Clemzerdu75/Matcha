import React, { Component } from 'react'
import Arrow from './../../../img/logo/arrow.png';
import ArrowB from './../../../img/logo/arrowb.png';

class Confirmation extends Component {
    constructor() {
        super()
        this.state= {
            disabled: false,
        }
        this.submit = this.submit.bind(this)
    }

    submit() {
        if(!this.state.disabled) {
            this.setState({  disabled: true })
            this.refs.btn.setAttribute("disabled", "disabled");
            this.props.submitRegistration()
           
        }
    }
    render() {
        return(
            <div className="subscription_card">
                <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", }}>Confirmation</h1>
                <h3 style={{marginLeft: "4%",  color: "grey", marginTop: "2%", width: "70%"}}>You're almost done!<br/> Now you can register or click on the back button to change your infos!</h3>
                <button className="button" style={{left: "20px", backgroundColor: "transparent"}} onClick={this.props.previousStep}><img  alt="" src={ArrowB}></img></button>
                <button className="button" ref="btn" style ={{backgroundColor: "#45bf37"}} disabled= { this.state.disabled } onClick={this.submit}><img alt="" src={Arrow}></img></button>
            </div>
        )
    }
}

export default Confirmation