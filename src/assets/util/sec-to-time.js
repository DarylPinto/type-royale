export default (seconds) => {
	let min = (Math.floor(seconds / 60)).toString();
	let sec = (seconds % 60).toString();
	if(sec < 10) sec = "0" + sec.toString();
	return `${min}:${sec}`;
}
