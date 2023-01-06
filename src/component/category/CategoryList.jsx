import React, { useEffect, useReducer } from "react";
import "./styles.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Context } from "../../context/Context";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };

    default:
      return state;
  }
};

function CategoryList() {
  const [{ loading, error, successDelete, categories }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      posts: [],
    }
  );

  const { state } = useContext(Context);
  const { userInfo } = state;

  //==============
  //FETCH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/category");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);
  console.log(categories);

  //==============
  //DELETE HANDLER
  //==============
  const deleteHandler = async (category) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/category/${category._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Deleted successfully", { position: "bottom-center" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  return (
    <div className="category_list">
      <Helmet>
        <title>Category List</title>
      </Helmet>

      <div className="posts">
        <div className="recent_post">
          <div className="header">
            <h2>All Category</h2>
            <div className="create_btn">
              <Link to="/new-category">
                <i className="fa-solid fa-square-plus"></i>
              </Link>
            </div>
          </div>
          {loading || successDelete ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell">Category</TableCell>
                    <TableCell className="tableCell">User</TableCell>
                    <TableCell className="tableCell">Date</TableCell>
                    <TableCell className="tableCell">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories?.map((c, index) => (
                    <TableRow key={index}>
                      <TableCell className="tableCell">{c.category}</TableCell>
                      <TableCell className="tableCell">
                        <div className="cellWrapper">
                          <img
                            src={c.user.profilePhoto}
                            alt=""
                            className="image"
                          />
                          {c.user.firstName} {c.user.lastName}
                        </div>
                      </TableCell>
                      <TableCell className="tableCell">
                        {c.updatedAt.substring(0, 10)}
                      </TableCell>

                      <TableCell className="tableCell">
                        <Link to={`/category/${c._id}`}>
                          <button className="tableBtn">Details</button>
                        </Link>
                        <button
                          onClick={() => deleteHandler(c)}
                          className="deleteButton"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
