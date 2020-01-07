import React, { Component } from "react"
import Checked from './../../img/logo/checked.png'
import { Link } from 'react-router-dom';
import { checkPassword } from './../../lib'
import axios from 'axios'

class PwdReset extends Component {
   constructor(props) {
       super(props);
       this.state= {
           NewPassword: "",
           error: "",
           succes: "",
       }
       this.onChange = this.onChange.bind(this)
       this.submit = this.submit.bind(this)
   } 

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    submit() {
        if(checkPassword(this.state.NewPassword)) {
            const searchParams = new URLSearchParams(this.props.location.search);
            let query = {
                token: searchParams.get('token'),
                email: searchParams.get('email'),
                password: this.state.NewPassword,
            }
            axios.put('http://localhost:8080/modifyPassword', query)
            .then((result) => {
                if (result.data === 'Password Modified') {
                    this.setState({ sucess: "You're new Password has been saved! Go back to landing page to login!"})
                } else {
                    console.log(result);
                }
            })
            
        } else {
            this.setState( {error: "Your new password doesn't fit with our privacy politicy" })
            setTimeout(() => {
                this.setState( {error: "" })
            }, 2000);
        }
    }

   render() {
       return (
        <div className="body" style={{backgroundColor: "white", zIndex: "50", position: "absolute", margin: "0 auto", width: "1000%", height: "1000%"}}>
            <h1 style={{marginBottom: "100px"}}>Reset Password</h1>
            <input
                value={this.state.NewPassword}
                type="password"
                onChange={this.onChange}
                name="NewPassword"
                placeholder="Your new Password"
                style={{width: "400px", marginLeft: "30px", fontFamily: "Helvetica Neue, sans serif"}}
            />
            <button style ={{backgroundColor: this.state.error.length ? "#FF1744" : "#45bf37", borderRadius: "50%"}} onClick={this.submit}><img style={{width: "60px", height: "60px"}} alt="" src={Checked}></img></button>
            <h2 style={{color: "#FF1744", marginLeft: "30px"}}>{this.state.error}</h2>
            <h2 style={{color: "#45bf37", marginLeft: "30px"}}>{this.state.sucess}</h2>
            <Link to="/"><h3 style={{margin: "0 auto", marginLeft: "30px"}}>Go to landing page</h3></Link>
        </div> 
       )
   
   }
}

export default PwdReset
