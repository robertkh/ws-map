import { notification } from "antd";
import "antd/dist/antd.css";

export function note4(type, title, dur = 5) {
  notification[type]({
    message: title,

    style: { fontWeight: "bold", fontStyle: "italic", width: "400px" },
    duration: dur,
  });
}

export function note1(icon, title, dur = 5) {
  notification.open({
    message: title,
    style: { fontWeight: "bold", fontStyle: "italic", width: "400px" },
    duration: dur,
    icon: icon,
  });
}
