import React, { Component } from 'react'
import Checked from './../../../img/logo/checked.png'

class Success extends Component {
    constructor(props) {
        super(props)
        this.finish = this.finish.bind(this)
    }

    finish() {
        const infos = 'finished'
        this.props.nextStep(infos)
    }

    render() {
        return (
            <div className="subscription_card" >
            <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", color:  "#2F2F2F" }}>Success</h1>
                <h3 style={{marginLeft: "4%", color: "#757575", marginTop: "2%"}}>Bravo! You're now register in our website!<br/>You will be able to sign in, but first you have to verify your account ...<br/>We send you a verification email, you have to opem it and follow the link</h3>
                <button className="button" style ={{backgroundColor: "#45bf37"}} onClick={this.finish}><img alt="" src={Checked}></img></button>
            </div>
        )
    }
}

export default Success