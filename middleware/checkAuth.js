//?
import jwt from "jsonwebtoken";
import { f_str, yl, rl } from "../util/logger.js";

// todo
export default function (req, res, next) {
  if (!req.cookies.access_token) {
    //
    rl.log(" No JWT provided");

    //
    return res.status(401).json("No JWT provided");
  }

  //
  const token = req.cookies.access_token.split(" ")[1];

  //
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    if (decoded._id === req.session.user.id) {
      next();
    } else {
      rl.log("Access denied. You are not Admin");

      res.status(403).json("Access denied. You are not Admin");
    }
  } catch (err) {
    rl.log("Invalid JWT.");

    res.json(
      "Ներողություն, գործողությունը կատարել հնարավոր չէ, դիմեք ադմինիստրատորին։"
    );
  }
}
