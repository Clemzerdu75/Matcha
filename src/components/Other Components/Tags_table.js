import React, { Component } from 'react'
import {Container, Row, Col} from "reactstrap"

class TableTags extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    checkifChecked(tag, user_tags) {
        if(user_tags && user_tags.length > 0 ) {
           for (var i in user_tags) {
                if(user_tags[i].name === tag)
                    return true
           }
        }
        return false;
    }

    removeItem(originalArray, itemToRemove) {
        let j = 0;

        while (j < originalArray.length) {
                if (originalArray[j].name === itemToRemove) {
                    originalArray.splice(j, 1);
            } else { j++; }
        }
        return originalArray;
    }

    handleChange(e) {
        let array = e.target.value.split(",")
        let tag = { name: array[0], type: array[1] }
        let tagModif = { new: "", delete: "" }
        let user_tags = this.props.user_tags

        if (this.checkifChecked(tag.name, this.props.user_tags)) {
            tagModif.delete = tag.name
            user_tags = this.removeItem(user_tags, tag.name)
        } else {
            tagModif.new = tag.name
            user_tags.push(tag)
        }
        this.props.Submit(user_tags, tagModif) 
    }

    render() {
        return(
            <Container>
                <Row>
                    <Col>
                        <h4 className="header_title">MUSIC</h4>
                        {this.props.tags.music.map( (t, i) => {
                        t = [t, "music"]
                        return <div key={i}>
                                <input 
                                    type="checkbox"
                                    value={t}
                                    checked={ this.checkifChecked(t[0], this.props.user_tags) ? true : false }
                                    onChange={ this.handleChange }
                                />
                                <label style={{color:"#fcb3f5"}}>{t[0]}</label>
                            </div>
                        })}
                    </Col>
                    <Col>
                    <h4 className="header_title">HOBBY</h4>
                        {this.props.tags.hobby.map( (t, i) => {
                        t = [t, "hobby"]
                        return <div key={i}>
                            <input 
                                type="checkbox"
                                value={t}
                                checked={ this.checkifChecked(t[0], this.props.user_tags) ? true : false }
                                onChange={ this.handleChange }
                            />
                            <label style={{color: "#ffdc91"}}>{t[0]}</label>
                        </div>
				        })}
                    </Col>
                    <Col>
                        <h4 className="header_title">DIET</h4>
                        {this.props.tags.diet.map( (t, i) => {
					      t = [t, "diet"]
                          return <div key={i}>
                              <input 
                                  type="checkbox"
                                  value={t}
                                  checked={ this.checkifChecked(t[0], this.props.user_tags) ? true : false }
                                  onChange={ this.handleChange }
                              />
                              <label style={{color: "#90ff8a"}}>{t[0]}</label>
                          </div>
				        })	}
                    </Col>
                    <Col >
                        <h4 className="header_title">SPORT</h4>
                        {this.props.tags.sport.map( (t, i) => {
                            t = [t, "sport"]
                            return <div key={i}>
                                <input 
                                    type="checkbox"
                                    value={t}
                                    checked={ this.checkifChecked(t[0], this.props.user_tags) ? true : false }
                                    onChange={ this.handleChange }
                                />
                                <label style={{color: "#ff9191"}}>{t[0]}</label>
                            </div>
                        })}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default TableTags