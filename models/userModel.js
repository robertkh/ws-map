//?
import mongoose from "../util/mongoose.js";
import jwt from "jsonwebtoken";
import { gl, rl } from "../util/logger.js";
import dotenv from "dotenv";
dotenv.config();

// todo
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    sparse: true, // dup kee problem
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isReged: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// todo
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.PRIVATE_KEY ||
      "mongodb+srv://heroku:TO79O0qWkOxrrSJi@cluster0.jmjzr.mongodb.net/ws-map-user?retryWrites=true&w=majority"
  );
  return token;
};

// todo
export default mongoose.model("User", userSchema);
