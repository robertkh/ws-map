//?
import { gl } from "../util/logger.js";
import express from "express";
var router = express.Router();

//todo - signup
import {
  signupValidator,
  signupValidationResult,
} from "../middleware/signupValidator.js";
import { postUserSignup } from "../routers/signupRouter.js";
import sendSignupMail from "../middleware/sendSignupMail.js";
router.post(
  "/signup",
  signupValidator,
  signupValidationResult,
  postUserSignup,
  sendSignupMail
);

//todo - login
import {
  loginValidator,
  loginValidationResult,
} from "../middleware/loginValidator.js";
import { postUserLogin } from "../routers/loginRouter.js";
router.post("/login", loginValidator, loginValidationResult, postUserLogin);

//todo
import { getUsersLogout } from "../routers/logoutRouter.js";
router.get("/logout", getUsersLogout);

//todo - reset
import {
  resetValidator,
  resetValidationResult,
} from "../middleware/resetValidator.js";
import { resetLink } from "../routers/resetRouter.js";
import sendResetMail from "../middleware/sendResetMail.js";
router.post(
  "/reset",
  resetValidator,
  resetValidationResult,
  resetLink,
  sendResetMail
);

//todo
import { setNewPassword } from "../routers/emailPassword.js";
router.get("/setnewpass/:id", setNewPassword);

//todo
import checkAuth from "../middleware/checkAuth.js";
router.get("/admin", checkAuth, (req, res) => {
  gl.log("lav a");
  res.json(true);
});

//todo
import { getUserName } from "../routers/avatarRouter.js";
router.get("/name", getUserName);

//todo
import { getUserActive } from "../routers/emailActive.js";
router.get("/:id", getUserActive);

//todo
export default router;
