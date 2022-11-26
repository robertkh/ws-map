//?
import User from "../models/userModel.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import { rl, yl } from "../util/logger.js";
import jwt from "jsonwebtoken";

// todo
export const setNewPassword = async (req, res) => {
  try {
    //
    const jwtToken = req.params.id;
    const decoded = jwt.verify(jwtToken, process.env.PRIVATE_KEY);

    //
    let user = await User.findOne({
      email: decoded.em,
    });
    if (!user) {
      return res
        .status(400)
        .json("Նման Էլեկտրոնային հասցեով օգտատեր գոյություն չունի։");
    }

    //
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(decoded.ps, salt);
    user.password = password;
    await user.save();

    //
    res.send("Ձեր ծածկագիրը հաջողությամբ փոփվեց։");
  } catch (err) {
    res.send("Ձեզ տրված ժամանակը սպառվել է։ Նորից փորձեք։");
    rl.log(err.message);
  }
};
