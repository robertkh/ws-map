//?
import { gl } from "../util/logger.js";

// todo
export const getUserName = (req, res) => {
  if (req?.session?.user?.name) {
    gl.log(req.session.user.name);
    res.json(req.session.user.name);
  } else {
    res.json("");
  }
};
