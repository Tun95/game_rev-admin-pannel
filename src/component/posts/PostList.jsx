import React, { useContext, useEffect, useReducer } from "react";
import "./styles.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import photo from "../../asset/photo.png";
import { toast } from "react-toastify";
import { Context } from "../../context/Context";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, posts: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

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

const columns = [
  { field: "id", headerName: "ID", width: 190 },
  {
    field: "post",
    headerName: "Post",
    width: 400,
    renderCell: (params) => {
      return (
        <>
          <div className="cellWidthImg">
            <img
              src={params.row.image || photo}
              alt="image_banner"
              className="cellImg"
            />
            {params.row.title}
          </div>
        </>
      );
    },
  },

  { field: "updatedAt", headerName: "Date", width: 150 },
  { field: "category", headerName: "Category", width: 200 },
];

function PostList() {
  const [{ loading, error, successDelete, posts }, dispatch] = useReducer(
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
        const { data } = await axios.get(`${request}/api/posts`);
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

  //==============
  //DELETE HANDLER
  //==============
  const deleteHandler = async (post) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`${request}/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Post deleted successfully", { position: "bottom-center" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (post) => {
        return (
          <div className="cellAction">
            <Link to={`/post/${post.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div onClick={() => deleteHandler(post)} className="deleteButton">
              Delete
            </div>
            <Link to={`/post-comment/${post.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Comments</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="post_list">
      <Helmet>
        <title>Posts List</title>
      </Helmet>
      <div className="post_list_box">
        <div className="datatable">
          <div className="header">
            <h2>All Post</h2>
            <div className="create_btn">
              <Link to="/new-post">
                <i className="fa-solid fa-square-plus"></i>
              </Link>
            </div>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={posts}
              columns={columns.concat(actionColumn)}
              pageSize={8}
              rowsPerPageOptions={[8]}
              checkboxSelection
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PostList;
