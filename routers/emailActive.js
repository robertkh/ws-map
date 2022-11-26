//?
import User from "../models/userModel.js";
import { rl, yl, gl } from "../util/logger.js";

// todo
export const getUserActive = async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.id,
    });

    //
    if (!user) {
      return res.status(400).json("No such user.");
    }

    user.isReged = true;

    //
    await user.save();
    gl.log("Account has activated");

    //
    res.end("You successfully activated your account");
  } catch (err) {
    rl.log(err.message);
  }
};
