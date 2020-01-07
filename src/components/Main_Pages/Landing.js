import React from "react";

const Landing = () => {
	return (
		<div>
			<div style={{position: "fixed", zIndex: "-99", width: "100%", height: "100%", borderRadius: 0}}>
				 <video  autoPlay style={{ height: "100%", borderRadius: "0", width: "100%", margin: "0 auto"}}>
  					<source src="http://localhost:8080/video" type="video/mp4"></source>
				</video>
			</div>
		</div>
	)
}

export default Landing;
