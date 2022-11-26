export default function polyLine(arr) {
	return arr.map((item) => ({ lat: item.lat, lng: item.lng }));
}
