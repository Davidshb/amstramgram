export function capitalizeWords(str) {
	str[0] = str[0].toUpperCase()
	for(let i=1;i<str.length;i++)
		if(str[i-1] === "")
			str[i] = str[i].toUpperCase()

	return str
}