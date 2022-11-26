//?
import { rl, yl } from "../util/logger.js";

// todo
export const getUsersLogout = async (req, res) => {
	try {
		req.session.user = "";
		res.json(`${req.session.user}`);
	} catch (err) {
		rl.log(err.message);
	}
};
