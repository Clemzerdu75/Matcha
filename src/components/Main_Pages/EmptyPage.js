import React from "react";


const EmptyPage = () => {
	return (
	<div className="body">
        <div style={{width: "100%", height:"10%"}}></div>
        <h2 style={{color: "#FF1744",  margin: "0 auto", width: "65%", textAlign: "justify",textTransform: "uppercase", fontSize: "4.1vw" }}>You must complete your ACCOUNT before accessing this page </h2>
        <br/>
        <h3 style={{ margin: "0 auto", width: "65%", textAlign: "justify", fontSize: "2vw"}}> To fill your profil you need to provide your Birthdate, sexual orientation (witch is by default bisexual), upload some picture and write a description...<br/>
        You can do that in the information page</h3>
    </div>		
	)
}

export default EmptyPage
