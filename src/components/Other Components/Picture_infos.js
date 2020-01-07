import React, { Component } from 'react'
import FileBase64 from "react-file-base64"
import axios from "axios"
import upload from './../../img/logo/upload.png'
import cross from './../../img/logo/red_cross.png'


class PictureInfos extends Component {
    constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
        this.handlePP = this.handlePP.bind(this)
    }

getFiles(file) {
	let type = file.type.split("/")
    let Newgallery = this.props.gallery
	let userPic = {
		pseudo: this.props.pseudo,
		newPic: file.base64,
		type: type[1]
    }
    if(this.props.gallery.length <= 4)
        axios.post(`http://localhost:8080/user/picture/new`, { data:  userPic })
            .then((result) => {
                Newgallery.push(result.data)
                return Newgallery
            })
            .then((result) => {
                this.props.onSubmit(result)
            })
}

handleDelete(e) {
    let gallery = this.props.gallery
    for(let i = 0; i < gallery.length; i++) {
        if (gallery[i] === e.target.value)
            gallery.splice(i, 1)
    }
    this.props.onSubmit(gallery)
    this.props.onDelete(e.target.value)

}

handlePP(e) {
    let gallery = this.props.gallery
    for(let i = 0; i < gallery.length; i++) {
        if (gallery[i] === e.target.value)
            gallery.splice(i, 1)
    }
    gallery.unshift(e.target.value)
    this.props.onSubmit(gallery)
}



    render() {
        const that = this
        const gallery = this.props.gallery ? this.props.gallery.map((g, i) => {
             if(g.length)
                return (
                    <div className="image_container" key={i} >
                        <label>
                            <input style={{display: "none"}} type="button" value={g} onClick={(e) => that.handlePP(e)} />
                            <img className="image" style={{height: "100px", display: "inline-block", marginRight: "10px", borderRadius: "5px"}}  alt="" src={g} ></img>
                        </label>
                        <div className="middle">
                        <label >
                            <input style={{display: "none"}} type="button" value={g} onClick={(e) => that.handleDelete(e)} />
                                <img  className="text" src={cross} alt=""></img>
                            </label>
                        </div>
                    </div>  
        );
        else
            return null;
    }, this ) : null
        return (
            <div className="filter_col" style={{height: "auto", textAlign: "center", backgroundColor: "white", borderRadius: "10px", boxShadow: "0px 3px 8px rgb(0,0,0, .1)", paddingTop: "20px", paddingBottom: "10px" }} >
			<img src={this.props.ProfilPicture} alt="" style={{height: "250px", marginBottom: "20px", borderRadius: "5px"}}></img>
			<br/>
			<div className="picture" style={{ height: "110px", width: "80%", margin: "0 auto", backgroundColor: "white", borderRadius: "5px", marginBottom: "10px"}}>
                <div className="Gallery_row">  
                {gallery}
                </div>  
			</div>
            <div className="upload-btn-wrapper">
                <button className="btn"><img style={{height: "60px"}} src={upload} alt=""></img></button>
                <FileBase64
                    className="pic_upload"
					multiple={ false }
					onDone={ this.getFiles.bind(this) } />
            </div>
			</div>
        )				
    }
}

export default PictureInfos