import React from "react";
import Cards from "../../component/dashboard/Cards";
import Posts from "../../component/dashboard/Posts";
import Users from "../../component/dashboard/Users";
import "./styles.scss";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useEffect } from "react";
import { useReducer } from "react";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };

    default:
      return state;
  }
};

function Dashboard(props) {
  const [{ summary }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    summary: [],
  });

  //==============
  //FETCH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/posts/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };

    fetchData();
  }, []);
 
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Cards summary={summary} />
      <div className="post_user">
        <Posts />
        <Users />
      </div>
    </>
  );
}

export default Dashboard;
