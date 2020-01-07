import React from 'react'

const Tag = (props) => {
	var colors = ''
	if (props.item.type === "hobby")
		colors = "#ffdc91"
	else if (props.item.type === "music")
		colors = "#fcb3f5"
	else if (props.item.type === "sport")
		colors = "#ff9191"
	else
		colors="#90ff8a"

	const tag_color = {
		color: colors,
	}
	if(props.item.name[0] !== "#")
		props.item.name =  `#${props.item.name} `

	return (
		<p style={tag_color}>{props.item.name}&nbsp;</p>
	)
}

export default Tag
