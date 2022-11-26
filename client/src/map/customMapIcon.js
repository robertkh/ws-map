export default function icon(acc) {
	//
	if (acc > 25) {
		return `http://maps.google.com/mapfiles/ms/icons/red-dot.png`;
	}
	if (acc > 10) {
		return `http://maps.google.com/mapfiles/ms/icons/yellow-dot.png`;
	}
	return `http://maps.google.com/mapfiles/ms/icons/green-dot.png`;
}
