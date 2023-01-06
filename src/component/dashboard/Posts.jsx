import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useReducer } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, posts: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};

function Posts() {
  const [{ loading, error, posts }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    posts: [],
  });
  //===========
  //POST FILTER
  //===========
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get("query") || "all";

  //==============
  //FETCH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/posts/home?query=${query}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    fetchData();
  }, [query]);
  console.log(posts);

  return (
    <div className="posts">
      <div className="recent_post">
        <h2>Recent Post</h2>
        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">Post</TableCell>
                <TableCell className="tableCell">Date</TableCell>
                <TableCell className="tableCell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts?.posts?.slice(0, 10)?.map((post, index) => (
                <TableRow key={index}>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <img src={post.image} alt="" className="image" />
                      {post.title}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell">
                    {post.createdAt.substring(0, 10)}
                  </TableCell>

                  <TableCell className="tableCell">
                    <Link to={`/post/${post.id}`}>
                      <button className="tableBtn">Details</button>
                    </Link>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Posts;
