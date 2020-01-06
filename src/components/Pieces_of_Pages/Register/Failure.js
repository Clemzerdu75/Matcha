import React, { Component } from 'react'
import Cross from './../../../img/logo/red_cross.png'

class  Failure extends Component {
    constructor(props) {
        super(props)
        this.restart = this.restart.bind(this)
    }


    restart() {
        const infos = "finished"
        this.props.nextStep(infos)
    }

    render() {
        return (
            <div className="subscription_card" >
            <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%", fontSize: "6em", color:  "#2F2F2F" }}>Failure</h1>
                <h3 style={{marginLeft: "4%",  color: "grey", marginTop: "2%", width: "70%"}}>Something went wrong.<br/>
                It's probably because your pseudo or email is already used.<br/> Or you tried nasty things 😈 </h3>
                <button className="button" style ={{backgroundColor: "transparent"}} onClick={this.restart}><img alt="" src={Cross}></img></button>
            </div>
        )
    }
   
}

export default Failure