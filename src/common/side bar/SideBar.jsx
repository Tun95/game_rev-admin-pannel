import React from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";

import { useEffect } from "react";
import { useReducer } from "react";
import { Context } from "../../context/Context";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, settings: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_BANNER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_BANNER_SUCCESS":
      return { ...state, loading: false, adverts: action.payload };
    case "FETCH_BANNER_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function SideBar(props) {
  const [{ settings, adverts }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    settings: [],
  });

  const { state, dispatch: ctxDispatch } = useContext(Context);

  //==============
  //FETCH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/settings`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    fetchData();
  }, []);

  //==============
  //FETCH BANNER HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_BANNER_REQUEST" });
        const { data } = await axios.get(`${request}/api/ads`);
        dispatch({ type: "FETCH_BANNER_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_BANNER_FAIL" });
      }
    };
    fetchData();
  }, []);

  //=================
  // LOGOUT
  //=================
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("!userInfo" && "cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/";
  };

  return (
    <div className={"side_bar active"}>
      <div className="side_bar_box">
        <ul className="side_bar_list">
          <li>
            <Link to="/">
              <span className="icon">
                <i className="fa-solid fa-gauge"></i>
              </span>
              <span className="title">
                <h2>GM Admin</h2>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="icon">
                <i className="fa-solid fa-house-chimney"></i>
              </span>
            </Link>
            <span className="title">Dashboard</span>
          </li>
          <li>
            <Link to="/category">
              <span className="icon">
                <i className="fa-solid fa-list"></i>
              </span>
            </Link>{" "}
            <span className="title">Categories</span>
          </li>
          <li>
            <Link to="/users">
              <span className="icon">
                <i className="fa-solid fa-users"></i>
              </span>
            </Link>{" "}
            <span className="title">Users</span>
          </li>
          <li>
            <Link to="/posts">
              <span className="icon">
                <i className="fa-solid fa-square-plus"></i>
              </span>
            </Link>{" "}
            <span className="title">Posts</span>
          </li>
          <li>
            <Link to="/subscriber">
              <span className="icon">
                <i className="fa-solid fa-users-viewfinder"></i>
              </span>
            </Link>{" "}
            <span className="title">Subscriber</span>
          </li>
          <li>
            {adverts?.map((ad, index) => (
              <Link to={`/advertise/${ad._id}`} key={index}>
                <span className="icon">
                  <i className="fa-solid fa-rectangle-ad"></i>
                </span>
              </Link>
            ))}
            <span className="title">Ads</span>
          </li>
          <li>
            {settings.map((s, index) => (
              <Link key={index} to={`/settings/${s._id}`}>
                <span className="icon">
                  <i className="fa-solid fa-gear"></i>
                </span>
              </Link>
            ))}
            <span className="title">Settings</span>
          </li>
          <li>
            <Link to="/" onClick={signoutHandler}>
              <span className="icon">
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
            </Link>{" "}
            <span className="title">Signout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
