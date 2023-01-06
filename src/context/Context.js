import { useState } from "react";
import { useReducer } from "react";
import { createContext } from "react";

export const Context = createContext();

//CartItems Fetching
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    //SIGN IN & SIGN OUT
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
      };

    default:
      return state;
  }
}

export function ContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
