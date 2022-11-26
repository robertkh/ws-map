//?
import User from "../models/userModel.js";
// import bcrypt from "bcrypt";
import { rl, yl } from "../util/logger.js";
import jwt from "jsonwebtoken";

// todo
export const resetLink = async (req, res, next) => {
	try {
		//
		let user = await User.findOne({
			email: req.body.email,
		});

		//
		if (!user) {
			return res.status(400).json("Էլեկտրոնային հասցեն սխալ է։");
		}

		//
		res.locals.jwt = jwt.sign(
			{
				em: req.body.email,
				ps: req.body.password,
			},
			process.env.PRIVATE_KEY,
			{
				expiresIn: "1h",
			}
		);

		//
		res.json("Ծածկագրի փոփոխություններն ամրագրելու համար՝ տես E-mail։");

		//
		next();
	} catch (err) {
		rl.log(err.message);
	}
};
