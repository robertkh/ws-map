//?
import { ml, f_str, rl, yl } from "./logger.js";
import mongoose from "mongoose";

const uri =
  "mongodb+srv://heroku:TO79O0qWkOxrrSJi@cluster0.jmjzr.mongodb.net/ws-map-user?retryWrites=true&w=majority";

//?
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => ml.log("MongoDB has been connected!"))
  .catch((err) => {
    rl.log(f_str(`Something went wrong\n ${err.message}`));
    process.exit(1);
  });

// todo
export default mongoose;
