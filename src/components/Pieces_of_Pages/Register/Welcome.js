import React from 'react'
import Arrow from './../../../img/logo/arrow.png';

const Welcome = (props) => {
    return(
        <div className="subscription_card" >
            <h1 style={{ marginTop: "0", marginLeft: "4%", paddingTop: "2%"}}> Welcome</h1>
            <h3 style={{marginLeft: "4%", color: "grey", marginTop: "2%", width: "70%"}}>Matcha is world fill with passion and love.<br/> Here you gonna find awesome people like you :) 
            <br/>But first you need to create an account<br/>Follow us it won't be long!</h3>
            <button className="button" onClick={props.nextStep} style={{backgroundColor: "#45bf37"}}><img  alt="" src={Arrow}></img></button>
        </div>
    )
}

export default Welcome 