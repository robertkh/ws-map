//?
import { check, validationResult } from "express-validator";
import { gl } from "../util/logger.js";

// todo
export const resetValidator = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email: դաշտը դատարկ է")
    .isEmail()
    .withMessage("Email: նամակի ֆորմատ չէ"),
  check("password")
    .exists()
    .not()
    .isEmpty()
    .withMessage("Password: դաշտը դատարկ է")
    .trim()
    .escape()
    .isLength({
      min: 6,
      max: 20,
    })
    .withMessage("Password: պետք է ունենա 6-20 սիմվոլ"),
];

// todo
export const resetValidationResult = (req, res, next) => {
  //
  const result = validationResult(req).array()[0];

  if (result) {
    return res.status(422).jsonp(result.msg);
  } else {
    gl.log(" Ok, successfully passed the resetValidation");
  }

  //
  next();
};
