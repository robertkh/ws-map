//?
import { f_str, rl, gl } from "../util/logger.js";
import _ from "lodash";
import session from "../middleware/session.js";

const markers = {};

let adminConn = null;

// todo
export default function conn(request) {
  // rl.log(f_str(request.origin)); // 👉  https://ws-map.herokuapp.com
  // gl.log(request.cookies); // հետաքրքիր չի
  const connection = request.accept(null, request.origin);

  //📌 Տարբեր տեղերում օգտագօրծվող
  let cl;

  //🔶
  session(request.httpRequest, {}, function () {
    // cl 👉 {is:, id:, name:}
    cl = request.httpRequest.session.user;

    if (cl.is) {
      adminConn = connection;
      gl.log(f_str("admin connected"));
    } else {
      gl.log(f_str("client connected"));

      if (!(cl.id in markers)) {
        markers[cl.id] = [];
      }
    }
  });

  //🔶
  connection.on("message", function (message) {
    if (message.type !== "utf8") return;

    const dataFromClient = JSON.parse(message.utf8Data);

    rl.log(f_str(message.utf8Data));

    if (dataFromClient?.type === "polyline") {
      // console.log(
      //   JSON.stringify({
      //     type: "polyline",
      //     id: dataFromClient.id,
      //     polData: markers[dataFromClient.id],
      //   })
      // );

      adminConn.send(
        JSON.stringify({
          type: "polyline",
          id: dataFromClient.id,
          polData: markers[dataFromClient.id],
        })
      );

      return;
    }

    if (dataFromClient?.type === "from driver") {
      markers[cl.id].push(dataFromClient?.data);
    }

    rl.log(f_str(markers[cl.id].length));

    if (adminConn) {
      adminConn.send(
        JSON.stringify({
          data: dataFromClient?.data,
          id: cl.id,
          name: cl.name,
        })
      );
    }
  });

  //🔶
  connection.on("close", function (reasonCode, description) {
    if (connection === adminConn) {
      adminConn = null;
      rl.log(f_str(`admin disconnected - ${reasonCode}`));
    } else {
      rl.log(f_str(`client disconnected - ${reasonCode}`));

      if (adminConn) {
        adminConn.send(
          JSON.stringify({
            data: null,
            id: user.id,
            name: user.name,
          })
        );
      }
    }
  });
}
