import React, { useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { useReducer } from "react";
import { toast } from "react-toastify";
import "./styles.scss";
import { getError } from "../../utils/Utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, subscribers: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, errors: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    case "SEND_REQUEST":
      return { ...state, loading: true };
    case "SEND_SUCCESS":
      return { ...state, loading: false };
    case "SEND_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};
function Subscriber() {
  const editor = useRef(null);

  const [{ loading, error, subscribers, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      users: [],
    }
  );

  //FETCH ALL SUBSCRIBERS
  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: "FETCH_SUBSCRIBER_REQUEST" });
      try {
        const { data } = await axios.get("/api/subscribe");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
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
  const deleteHandler = async (subscriber) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/subscribe/${subscriber._id}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Deleted successfully", { position: "bottom-center" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "DELETE_FAIL" });
    }
  };

  //==============
  //SEND
  //==============
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const sendHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/subscribe/message", {
        subject,
        message,
      });
      dispatch({ type: "SEND_SUCCESS", payload: data });
      toast.success("Email sent successfully", { position: "bottom-center" });
    } catch (err) {
      dispatch({ type: "SEND_FAIL" });
      toast.error(getError(err), { position: "bottom-center" });
    }
  };

  return (
    <div className="subscriber">
      <Helmet>
        <title>News Letter</title>
      </Helmet>
      <div className="subscriber_box">
        {/* {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : ( */}
        <div className="box">
          <div className="list">
            <h3>Subscriber:</h3>
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell">Category</TableCell>
                    <TableCell className="tableCell">Date</TableCell>
                    <TableCell className="tableCell">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscribers?.map((c, index) => (
                    <TableRow key={index}>
                      <TableCell className="tableCell">{c.email}</TableCell>

                      <TableCell className="tableCell">
                        {c.createdAt.substring(0, 10)}
                      </TableCell>

                      <TableCell className="tableCell">
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
          </div>
          <form action="" onSubmit={sendHandler} className="form_box">
            <div className="form_group">
              <h3>Send Message:</h3>
              <div className="input_box">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="subject"
                />
              </div>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={message}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setMessage(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="btn">
              <button>Send</button>
            </div>
          </form>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Subscriber;
