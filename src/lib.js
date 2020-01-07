
/* --- Sort functions --- */

function getPref(user) {
	if (user.gender === "male" && user.orientation === "heterosexual")
		return ("female")
	else if (user.gender === "male" && user.orientation === "homosexual")
		return("male")
	else if (user.gender === "female" && user.orientation === "heterosexual")
		return ("male")
	else if (user.gender === "female" && user.orientation === "homosexual")
		return("female")
	else
		return (null)
}

export function BasicSort(user, libraries, blocked) {
	if (libraries) {
		libraries = libraries.filter(function(i) {
			return i.pseudo !== user.pseudo })
		if(blocked) {
			libraries = libraries.filter(function(i)  {
				if(blocked.indexOf(i.pseudo) === -1)
					return i
				else
					return null
			})
		}
		if (user.orientation !== "bisexual") {
			const gender_wanted = getPref(user)
			const regex = new RegExp(`\\b${gender_wanted}\\b`, "g")

			libraries =  libraries.filter(function(i) {
				return i.gender.match(regex) });
			libraries = libraries.filter(function(i) {
				return i.orientation.match(user.orientation) || i.orientation.match('bisexual')
			})
		}
		else {
			libraries =  libraries.filter(function(i) {
				if(i.gender === user.gender)
					return i.orientation.match('bisexual') || i.orientation.match('homosexual')
				else 
					return i.orientation.match('bisexual') || i.orientation.match('heterosexual')
			});
		}
	}
	return libraries
}


export function SortbyIncreasingAge(libraries) {
	if (libraries) {
		libraries = libraries.sort(function(a, b) {
			return a.age - b.age
		})
	}
	return libraries
}

export function SortbyDecreasingAge(libraries) {
	if (libraries) {
		libraries = libraries.sort(function(a, b) {
			return b.age - a.age
		})
	}
	return libraries
}

export function SortbyLocalisation(libraries, user) {
	
	libraries = libraries.map((l) => {
		let locScore = 100
		if (l.lat && l.lon && user.lat && user.lon) {
			locScore = (Math.abs(Number(l.lat) - Number(user.lat)) + (Math.abs(Number(l.lon) - Number(user.lon))))
		}
		l.locScore = locScore
		return l
	})
	libraries = libraries.sort(function(a, b) {
		return a.locScore - b.locScore
	})
	return libraries
}

export function SortbyTag(user, libraries) {
	if(libraries) {
		libraries = libraries.map((l) => {
			l.score = 0
			if(l.tags) {
				for (let i = 0; i < user.tags.length; i++)
					for (let j = 0; j < l.tags.length; j++)
						if(l.tags[j].name === user.tags[i].name)
							l.score += 1;
			}
			return l
		})
		libraries = libraries.sort(function(a, b) {
			return b.score - a.score
		})
	}
	return (libraries)
}

export function sortByPopularity(libraries) {
	if(libraries) {
		libraries = libraries.sort(function(a, b) {
			return b.popularity - a.popularity
		})
	}
	return libraries
}

export function algoSort(libraries, user) {
	if(libraries) {
		libraries = libraries.map((l) => {
			l.score = 0
			l.score = 50 - (Math.abs(Number(l.popularity) - Number(user.popularity)))
			l.score +=  50 - (Math.abs(Number(l.age) - Number(user.age)))
		
			let locScore = 50;
			if (l.lat && l.lon && user.lat && user.lon) {
				locScore = (Math.abs(Number(l.lat) - Number(user.lat)) + (Math.abs(Number(l.lon) - Number(user.lon))))
				locScore =  100 - (locScore * 3)
			} 
			l.score += locScore
			if(l.tags) {
				let tags = l.tags
				for(let i=0;i<tags.length;i++)
				{
					tags[i].name = tags[i].name.replace(/\s+/, "");
					tags[i].name = tags[i].name.replace('#', "");
				}
				for (let i = 0; i < user.tags.length; i++) {
					const result = tags.find(tags => tags.name === user.tags[i].name)
				
					if (result)
						l.score += 10
				}
			}
			return l
		})
		libraries = libraries.sort(function(a, b) {
			return b.score - a.score
		})
	}
	return (libraries)
}

export function getLocRange(localisation, n) {
	let pi = Math.PI
	let XLatitude = (n*1) / 111.11;
	let cosinusLong = Math.cos((localisation.lat) * (pi/180));
	let UnLongitude = 111.11 * cosinusLong;
	let XLongitude = n / UnLongitude;
	 
	let XLatitude1 = localisation.lat - XLatitude;
	let XLatitude2 = localisation.lat + XLatitude;
	 
	let XLongitude1 = localisation.lng - XLongitude;
	let XLongitude2 = localisation.lng + XLongitude;
	const range = [ XLatitude1, XLatitude2, XLongitude1, XLongitude2 ]
	return range
}

export function filterSort(libraries, filter) {
	if(filter.age_min && filter.age_max) {
		let a_max = Number(filter.age_max)
		let a_min = Number(filter.age_min)
		if(a_min > a_max)
			a_max = a_min
		libraries = libraries.filter((l) => {
		 	if( l.age >= a_min && l.age <= a_max)
				return l;
			else
				return null;
		})
	}
	if(filter.pop_min && filter.pop_max) {
		let p_max = Number(filter.pop_max)
		const p_min = Number(filter.pop_min)
		if(p_min > p_max)
			p_max = p_min
		libraries = libraries.filter((l) => {
		 	if( l.popularity >= p_min && l.popularity <= p_max)
				return l;
			else
				return null;
		})
	}
	if(!filter.male || !filter.female) {
		if(!filter.male)
			libraries = libraries.filter((l) => {
				if (l.gender !== "male")
					return l
				else
					return null
			})
		if (!filter.female)
			libraries = libraries.filter((l) => {
				if (l.gender !== "female")
					return l
				else 
					return null
			})
	}
	if(filter.loc_google_response && filter.loc_google_response.lat > 0) {
		const range = getLocRange(filter.loc_google_response, filter.range)
		
		libraries = libraries.filter((l) => {
			if(l.lat && l.lon) {
				if(l.lat >= range[0] && l.lat <= range[1] 
					&& l.lon >= range[2] && l.lon <= range[3])
					return l;
		  		else
					return null;
			}
			else
				return null;
	   })
	}
	if(filter.tags_list && filter.tags_list.length) {
		libraries = libraries.filter((l) => {
			if(l.tags) {
				for (let i = 0; i < filter.tags_list.length; i++) {
					const result = l.tags.find(tags => tags.name === filter.tags_list[i])
					if (result)
						return l
				}
				return null
			}
			else
				return null
		})
		
	}
	
	return libraries
}

export function globalSort(users, filter, order, logged_user, blocked) {
	let libraries = BasicSort(logged_user, users, blocked)
	switch (order) {
		case "auto":
			libraries = algoSort(libraries, logged_user)
		break
		case "d_age":
			libraries = SortbyDecreasingAge(libraries)
		break
		case "i_age":
			libraries = SortbyIncreasingAge(libraries)
		break
		case "tag":
			libraries = SortbyTag(logged_user, libraries)
		break
		case "localisation":
			libraries = SortbyLocalisation(libraries, logged_user )
		break
		case "popularity":
			libraries = sortByPopularity(libraries)
		break
		default:
			libraries = algoSort(libraries, logged_user)
	}
	
	libraries = filterSort(libraries, filter)
	return libraries
} 




/* --- Regex shit --- */

export function checkNames(name) {
	if (/^[A-Za-z'àáâãäåçèéêëìíîïðòóôõöùúûüýÿ-]{2,10}$/i.test(name))
		return true
	else
		return false
}

export function checkPseudo(pseudo) {
	if (/^[A-Za-z0-9'-]{2,10}$/i.test(pseudo))
		return true
	else
		return false
}

export function checkMail(email) {
	if (/^[^\W][a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/i.test(email))
		return true
	else
		return false
}

export function checkPassword(password) {
	if (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/i.test(password))
		return true
	else
		return false
}

export function checkDate(birthdate) {
	let year = 0
	let splitted = birthdate.split('-')
	if(splitted[0].length === 4)
		year = splitted[0]
	else
		year = splitted[2]
	let min = 1920
	let max = 2001
	if(Number(year) > min && Number(year) < max)
		return true	
	else
		return false;
}

export function CheckifBlocked(libraries, blocked) {
	if(blocked) {
		libraries = libraries.filter(function(i)  {
			if(blocked.indexOf(i.pseudo) === -1)
				return i
			else
				return null
		})
	}
	return libraries
}
