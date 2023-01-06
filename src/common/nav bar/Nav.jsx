import React, { useContext } from "react";
import "./styles.scss";
import profile from "../../asset/profile.png";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Nav(props) {
  const { state } = useContext(Context);
  const { userInfo } = state;

  //===========
  //SEARCH BOX
  //===========
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/?query=${query}` : "/");
    window.scrollTo(0, 0);
  };
  return (
    <div className="nav">
      <div className="nar_bar nav_flex">
        <div className="chart_icon"></div>
        <form action="" onSubmit={submitHandler} className="search">
          <label htmlFor="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search here"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </label>
        </form>
        <div className="user">
          <img src={userInfo?.profilePhoto || profile} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Nav;
