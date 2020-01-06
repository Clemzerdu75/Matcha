import React, { Component } from 'react'
import { Transition } from 'react-transition-group'
import { Link } from 'react-router-dom';
import axios from 'axios';

class Dashboard extends Component {
    constructor() {
        super()
        this.state = {
            pseudo: window.localStorage.pseudo,
            user: {
                gallery: []
            },
            loading: false,
            list: false,
            userView: [],
        }
        this.showList = this.showList.bind(this)
    }

    componentDidMount() {
        this.setState({loading: true})
		axios.get(`http://localhost:8080/user/${this.state.pseudo}`)
			.then(response => response.data)
            .then(data => {
                this.setState({
                    loading: false,
					user: data,
				})
            })
        axios.get(`http://localhost:8080/relation/view/${this.state.pseudo}`)
        .then(response => response.data)
        .then(data => {
            console.log(data);
            this.setState({
                userView: data,
            })
        })
    }

    showList() {
        this.setState((prevState) => { return {list: !prevState.list} })
    }

    render() {
        let UserView = this.state.userView ? this.state.userView.map((element, i) => {
            if(element.pseudo !== this.state.pseudo) {
                return(
                    <div key={i} className="P_row" style={{marginTop: "20px"}}>
                        <img style={{height: "75px", width: "75px", borderRadius: "5px"}} alt="" src={element.picture}></img>
                        <div style={{marginLeft: "10px"}}>
                            <h3 style={{ fontSize: "1.5em", marginBottom: "10px", marginTop: "10px", fontWeight: "400"}}><strong style={{fontWeight:"900"}}>{element.pseudo}</strong> has seen your profil</h3>
                            <h4 style={{color: "#bfbfbf",}}>{element.date}</h4>
                        </div>
                    </div>
                )
            } else
                return null
        }) : null
        UserView = UserView.filter(function (el) {
            return el != null;
          });
        const UserCount = UserView ? UserView.length : 0
        return (
            <div>
                {this.state.list ?
                <div>
                    <div className="clickable_area"  onClick={this.showList}></div>
                    <div className="card" style={{padding: "10px 10px", paddingTop: 0, maxHeight: "400px", overflowX: "scroll"}}>
                        {UserView}
                    </div>
                </div> : null }
                <Transition timeout={200} in={true} appear>
			    {(status) => (
                    <div className={`dashboard dashboard-${status}`}>
                        <h3 style={{fontWeight: "900", marginTop: "5px",textAlign: "left" }}>Dashboard</h3>
                        <h4 style={{fontSize: "2em",  marginTop: "15px", marginBottom: "10px"}}>{this.state.user.pseudo}</h4>
                        <img style={{ borderRadius: "10%", width: "150px", height: "150px" }} src={this.state.user.gallery.length? this.state.user.gallery[0] : null} alt=""></img>
                        <h4 style={{border: "solid 1.5px black", borderRadius: "5px", padding: "5px 10px", marginTop: "20px"}} onClick={this.showList}><strong style={{fontWeight: "900", fontSize: "1.1em"}}>{UserCount}</strong> {UserCount > 1 ? "users" : "user"} see your profil </h4>
                        <br/>
                        <div style={{textAlign: "center"}}>
                            <Link className="link" to="/Infos"><button style={{backgroundColor: "grey", padding: "10px 10px", color: "white", fontFamily: "Helvetica Neue, sans serif", fontWeight:"900", borderRadius: "5px"}}>Infos</button></Link>
                        </div>
                    </div>
                )}
                </Transition>
            </div>
        )
    }
}

export default Dashboard