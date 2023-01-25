import React from "react";
import "./styles.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";

import { toast } from "react-toastify";
import Axios from "axios";
import { getError } from "../../utils/Utils";
import { useEffect } from "react";
import { Context } from "../../context/Context";
import { request } from "../../base_url/Base_URL";

function Register() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUnUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUnUrl ? redirectUnUrl : "/";

  //=================
  // REGISTER
  //=================
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
	const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error("displayName,email or password field is required", {
        position: "bottom-center",
      });
    } else {
      try {
        const { data } = await Axios.post(`${request}/api/users/register`, {
          firstName,
					lastName,
          email,
          password,
        });
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Sign up successfully", { position: "bottom-center" });
        navigate(redirect || "/");
      } catch (err) {
        toast.error(getError(err), {
          position: "bottom-center",
          limit: 1,
        });
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="login s_flex">
      <div className="login_box">
        <form action="" onSubmit={submitHandler} className="form_input">
          <div className="form_header">
            <h1>Register</h1>
          </div>
          <div className="inner_form">
            <div className="form_group">
              <input
                type="name"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="first name"
              />
            </div>
            <div className="form_group">
              <input
                type="name"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
            <div className="form_group">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />
            </div>
            <div className="form_group">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            <div className="form_group">
              <button>Register</button>
            </div>
            <small>
              <span>Have an account?</span>
              <Link style={{ marginLeft: "5px" }} to="/login">
                Login
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
