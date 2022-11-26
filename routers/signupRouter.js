//?
import User from "../models/userModel.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import { rl } from "../util/logger.js";

// todo
export const postUserSignup = async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    //
    if (user) {
      return res
        .status(400)
        .json("Այս էլ-փոստով գրանցված օգտատեր արդեն գոյություն ունի։");
    }

    //!  user._id -ին ձևավորվում է այս քայլում։
    user = new User(_.pick(req.body, ["username", "email", "password"]));

    //
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.locals.uid = user._id;

    res.json(
      "Դուք հաջողությամբ գրանցվեցիք։ Նախքան Ձեր հաշիվից օգտվելը անհրաժեշտ է ակտիվացնել այն՝ տես E-mail։"
    );

    //
    next();
  } catch (err) {
    rl.log(err.message);
  }
};
