//?
import React, { useEffect, useReducer } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ResetForm from "./ResetForm";
import LogOut from "./LogOut";

// ?
const init = {
  login: false,
  signup: false,
  reset: false,
  logout: false,
};

// ?
function reducer(state, action) {
  switch (action.type) {
    // ?
    case "clearStates":
      return {
        ...init,
      };

    // ?
    case "showLogin":
      return {
        ...state,
        login: true,
      };

    // ?
    case "showSignup": {
      return { ...state, signup: true };
    }

    // ?
    case "showReset":
      return {
        ...state,
        reset: true,
      };

    // ?
    case "showLogout":
      return {
        ...state,
        logout: true,
      };

    // ?
    default:
      throw new Error();
  }
}

// todo
export default function Users() {
  // ?
  const [st, dispatch] = useReducer(reducer, init);

  // ?
  useEffect(() => {
    fetch("/users/name")
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          dispatch({ type: "showLogout" });
        } else {
          dispatch({ type: "showLogin" });
        }
      });
  }, [dispatch]);

  // ?
  return (
    <div className="mt-4">
      <div className="mx-auto w-100">
        {st.logout && <LogOut disp={dispatch} />}
        {st.login && <LoginForm disp={dispatch} />}
        {st.signup && <SignupForm disp={dispatch} />}
        {st.reset && <ResetForm disp={dispatch} />}
      </div>
    </div>
  );
}
