import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../context/Context";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { getError } from "../../utils/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPDATE_RESET":
      return {
        ...state,
        loadingUpdate: false,
        successUpdate: false,
      };

    default:
      return state;
  }
};

function UpdateUser() {
  const [{ loading, error, user, successUpdate }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const { state } = useContext(Context);
  const { userInfo } = state;

  const navigate = useNavigate();

  const params = useParams();
  const { id: userId } = params;

  const [profilePhoto, setProfilePhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  //=================
  //POST FETCHING
  //=================
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/details/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProfilePhoto(data.profilePhoto);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" });
    } else {
      fetchData();
    }
  }, [successUpdate, userId, userInfo]);

  //=================
  // UPDATING SETTINGS
  //=================
  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userId}`,
        {
          profilePhoto,
          firstName,
          lastName,
          email,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("User details updated successfully", {
        position: "bottom-center",
      });
			navigate("/users")
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Profile photo uploaded successfully", {
        position: "bottom-center",
      });
      setProfilePhoto(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <div className="update_user">
      <Helmet>
        <title>User Update</title>
      </Helmet>
      <div className="update_user_box">
        {loading || successUpdate ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <form
            action=""
            onSubmit={updateHandler}
            className="update_user_form d_flex"
          >
            <div className="image">
              <img src={profilePhoto} alt="" />
              <label htmlFor="file">
                <i
                  onChange={uploadFileHandler}
                  className="fa-solid fa-arrow-up-from-bracket"
                ></i>
              </label>
              <input
                onChange={uploadFileHandler}
                type="file"
                id="file"
                style={{ display: "none" }}
              />
            </div>
            <div className="inner_form">
              <div className="form_group">
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  id="first_name"
                  placeholder="first name"
                />
              </div>
              <div className="form_group">
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  id="last_name"
                  placeholder="last name"
                />
              </div>{" "}
              <div className="form_group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="email"
                />
              </div>
              <div className="submit_btn">
                <button type="submit">Update</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateUser;
