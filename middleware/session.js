//?
import session from "express-session";
import MongoStore from "connect-mongo";

//?

const uri =
  "mongodb+srv://heroku:TO79O0qWkOxrrSJi@cluster0.jmjzr.mongodb.net/ws-map-user?retryWrites=true&w=majority";

//?
const sess = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: uri,
    useUnifiedTopology: true,
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
};

// todo
export default session(sess);
