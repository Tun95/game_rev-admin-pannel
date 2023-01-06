import React, { useContext, useEffect, useReducer } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./styles.scss";
import axios from "axios";
import { Context } from "../../context/Context";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { request } from "../../base_url/Base_URL";

const columns = [
  { field: "id", headerName: "ID", width: 220 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <>
          <div className="cellWidthImg">
            <img src={params.row.profilePhoto} alt="" className="cellImg" />
            {params.row.firstName}
            &ensp;
            {params.row.lastName}
          </div>
        </>
      );
    },
  },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithStatus ${params.row.isBlocked}`}>
            {params.row.isBlocked === true ? (
              <span className="blocked">Blocked</span>
            ) : (
              <span className="active">Active</span>
            )}
          </div>
        </>
      );
    },
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };

    case "BLOCK_REQUEST":
      return { ...state, loadingBlock: true, successBlock: false };
    case "BLOCK_SUCCESS":
      return { ...state, loadingBlock: false, successBlock: true };
    case "BLOCK_FAIL":
      return { ...state, loadingBlock: false, errors: action.payload };
    case "BLOCK_RESET":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };

    case "UNBLOCK_REQUEST":
      return { ...state, loadingUnblock: true, successUnblock: false };
    case "UNBLOCK_SUCCESS":
      return { ...state, loadingUnblock: false, successUnblock: true };
    case "UNBLOCK_FAIL":
      return { ...state, loadingUnblock: false, errors: action.payload };
    case "UNBLOCK_RESET":
      return {
        ...state,
        loadingUnblock: false,
        successUnblock: false,
      };

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

function UserList() {
  const [
    { loading, error, users, successUnblock, successBlock, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    users: [],
  });

  const { state } = useContext(Context);
  const { userInfo } = state;

  //==============
  //FECTH HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/users`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successUnblock || successBlock || successDelete) {
      dispatch({ type: "UNBLOCK_RESET" });
      dispatch({ type: "BLOCK_RESET" });
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successBlock, successDelete, successUnblock]);
  console.log(users);

  //==============
  //BLOCK HANDLER
  //==============
  const blockHandler = async (user) => {
    try {
      dispatch({ type: "BLOCK_REQUEST" });
      await axios.put(`${request}/api/users/block-user/${user.id}`);
      dispatch({ type: "BLOCK_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "BLOCK_FAIL" });
    }
  };

  //==============
  //UNBLOCK HANDLER
  //==============
  const unBlockHandler = async (user) => {
    try {
      dispatch({ type: "UNBLOCK_REQUEST" });
      await axios.put(`${request}/api/users/unblock-user/${user.id}`);
      dispatch({ type: "UNBLOCK_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "UNBLOCK_FAIL" });
    }
  };

  //==============
  //DELETE HANDLER
  //==============
  const deleteHandler = async (user) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`${request}/api/users/${user.id}`);
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (user) => {
        return (
          <div className="cellAction">
            <div onClick={() => blockHandler(user)} className="blockButton">
              Block
            </div>
            <div onClick={() => unBlockHandler(user)} className="blockButton">
              UnBlock
            </div>
            <div onClick={() => deleteHandler(user)} className="deleteButton">
              Delete
            </div>
            <Link to={`/update_user/${user.id}`}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="user_list">
      <Helmet>
        <title>User List</title>
      </Helmet>
      <div className="user_list_box">
        {" "}
        <div className="datatable">
          <h2>All Users</h2>
          {loading || successUnblock || successBlock || successDelete ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <DataGrid
              className="datagrid"
              rows={users}
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

export default UserList;
