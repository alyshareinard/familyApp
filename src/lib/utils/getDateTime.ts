export function getDateTime(date: Date = new Date()) {
	const dayOfMonth = date.getDate();
	const month = date.getMonth(); // Be careful! January is 0, not 1
	const year = date.getFullYear();

	const dateString = dayOfMonth + '.' + (month + 1) + '.' + year;
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let strminutes = minutes < 10 ? '0' + minutes : minutes;
	let strTime = hours + ':' + strminutes + ' ' + ampm;
	return dateString + ' ' + strTime;
}