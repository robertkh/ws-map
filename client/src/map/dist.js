//?
import { getDistance } from "geolib";

// todo
export default function dist(arr) {
  let point = { latitude: arr[0].lat, longitude: arr[0].lng };

  let res = arr.reduce((d, item) => {
    let s = getDistance(
      point,
      {
        latitude: item.lat,
        longitude: item.lng,
      },
      0.001
    );

    point = {
      latitude: item.lat,
      longitude: item.lng,
    };
    return d + s;
  }, 0);
  return res;
}
