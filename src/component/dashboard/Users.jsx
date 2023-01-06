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
import axios from "axios";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};

function Users() {
  const [{ users }, dispatch] = useReducer(reducer, {
    users: [],
  });

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
    fetchData();
  }, []);


  return (
    <div className="users">
      <div className="recent_user">
        <h2>New User</h2>
        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">Users</TableCell>
                <TableCell className="tableCell">Date</TableCell>
                <TableCell className="tableCell">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 8)?.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <img src={user.profilePhoto} alt="" className="image" />
                      {user.firstName}
                      &ensp;
                      {user.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell">
                    {user.createdAt.substring(0, 10)}
                  </TableCell>
                  <TableCell className="tableCell">
                    <span className="status">
                      {user.isBlocked === true ? (
                        <span className="blocked">Blocked</span>
                      ) : (
                        <span className="active">Active</span>
                      )}
                    </span>
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

export default Users;
