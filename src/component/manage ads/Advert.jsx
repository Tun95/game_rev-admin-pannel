import React from "react";
import "./styles.scss";
import ads from "../../asset/ad.jpg";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/Utils";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, ads: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

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
function Advert() {
  const params = useParams();
  const { id: bannerId } = params;

  const [{ loading, error, successUpdate, ads }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [bannerOne, setBannerOne] = useState("");
  const [bannerLinkOne, setBannerLinkOne] = useState("");
  const [bannerTwo, setBannerTwo] = useState("");
  const [bannerLinkTwo, setBannerLinkTwo] = useState("");
  const [bannerThree, setBannerThree] = useState("");
  const [bannerLinkThree, setBannerLinkThree] = useState("");
  const [bannerFour, setBannerFour] = useState("");
  const [bannerLinkFour, setBannerLinkFour] = useState("");
  const [bannerFive, setBannerFive] = useState("");
  const [bannerLinkFive, setBannerLinkFive] = useState("");
  const [ppcOne, setPpcOne] = useState("");
  const [ppcTwo, setPpcTwo] = useState("");

  //==============
  //FETCH CATEGORY
  //==============

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/ads/${bannerId}`);
        setBannerOne(data.bannerOne);
        setBannerLinkOne(data.bannerLinkOne);
        setBannerTwo(data.bannerTwo);
        setBannerLinkTwo(data.bannerLinkTwo);
        setBannerThree(data.bannerThree);
        setBannerLinkThree(data.bannerLinkThree);
        setBannerFour(data.bannerFour);
        setBannerLinkFour(data.bannerLinkFour);
        setBannerFive(data.bannerFive);
        setBannerLinkFive(data.bannerLinkFive);
        setPpcOne(data.ppcOne);
        setPpcTwo(data.ppcTwo);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successUpdate) {
      dispatch({ type: "UPDATE_RESET" });
    } else {
      fetchData();
    }
  }, [bannerId, successUpdate]);

  //=================
  // UPDATING ADS
  //=================
  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/ads/${bannerId}`, {
        bannerOne,
        bannerLinkOne,
        bannerTwo,
        bannerLinkTwo,
        bannerThree,
        bannerLinkThree,
        bannerFour,
        bannerLinkFour,
        bannerFive,
        bannerLinkFive,
        ppcOne,
        ppcTwo,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Ads updated successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadBannerOneHandler = async (e) => {
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
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBannerOne(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadBannerTwoHandler = async (e) => {
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
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBannerTwo(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadBannerThreeHandler = async (e) => {
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
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBannerThree(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadBannerFourHandler = async (e) => {
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
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBannerFour(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadBannerFiveHandler = async (e) => {
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
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBannerFive(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <div className="advert">
      <div className="advert_box">
        {loading || successUpdate ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <form action="" onSubmit={updateHandler} className="inner_form_box">
            <small className="alert_info">
              Always click on update all button to update all your changes
            </small>
            <div className="ppa_ads">
              <h3>Manage PPC(Pay Per Click) Ads:</h3>
              <div className="input_form">
                <div className="form_group">
                  <small>Your PPC Link here:</small>
                  <br />
                  <input
                    type="text"
                    value={ppcOne}
                    onChange={(e) => setPpcOne(e.target.value)}
                    placeholder="your ppc link here"
                  />
                </div>
                <div className="form_group">
                  <small>Your PPC Link here:</small>
                  <br />
                  <input
                    type="text"
                    value={ppcTwo}
                    onChange={(e) => setPpcTwo(e.target.value)}
                    placeholder="your ppc link here"
                  />
                </div>
              </div>
            </div>
            <h3>Manage Banner Ads:</h3>

            <div className="inner_form l_flex">
              <div className="form_group">
                <small>Banner:</small>
                <div className="logo d_flex">
                  <img src={bannerOne} alt="" />
                  <label htmlFor="bannerOne">
                    <i
                      onChange={uploadBannerOneHandler}
                      className="fa-solid fa-upload"
                    ></i>
                    <input
                      type="file"
                      onChange={uploadBannerOneHandler}
                      id="bannerOne"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <small>your ads link here:</small>
                <br />
                <input
                  type="text"
                  value={bannerLinkOne}
                  onChange={(e) => setBannerLinkOne(e.target.value)}
                  placeholder="https://ads.advertise.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                />
              </div>
              <div className="form_group">
                <small>Banner:</small>
                <div className="logo d_flex">
                  <img src={bannerTwo} alt="" />
                  <label htmlFor="bannerTwo">
                    <i
                      onChange={uploadBannerTwoHandler}
                      className="fa-solid fa-upload"
                    ></i>
                    <input
                      type="file"
                      onChange={uploadBannerTwoHandler}
                      id="bannerTwo"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <small>your ads link here:</small>
                <br />
                <input
                  type="text"
                  value={bannerLinkTwo}
                  onChange={(e) => setBannerLinkTwo(e.target.value)}
                  placeholder="https://ads.advertise.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                />
              </div>
              <div className="form_group">
                <small>Banner:</small>
                <div className="logo d_flex">
                  <img src={bannerThree} alt="" />
                  <label htmlFor="bannerThree">
                    <i
                      onChange={uploadBannerThreeHandler}
                      className="fa-solid fa-upload"
                    ></i>
                    <input
                      type="file"
                      onChange={uploadBannerThreeHandler}
                      id="bannerThree"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <small>your ads link here:</small>
                <br />
                <input
                  type="text"
                  value={bannerLinkThree}
                  onChange={(e) => setBannerLinkThree(e.target.value)}
                  placeholder="https://ads.advertise.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                />
              </div>
              <div className="form_group">
                <small>Banner:</small>
                <div className="logo d_flex">
                  <img src={bannerFour} alt="" />
                  <label htmlFor="bannerFour">
                    <i
                      onChange={uploadBannerFourHandler}
                      className="fa-solid fa-upload"
                    ></i>
                    <input
                      type="file"
                      onChange={uploadBannerFourHandler}
                      id="bannerFour"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <small>your ads link here:</small>
                <br />
                <input
                  type="text"
                  value={bannerLinkFour}
                  onChange={(e) => setBannerLinkFour(e.target.value)}
                  placeholder="https://ads.advertise.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                />
              </div>
              <div className="form_group">
                <small>Banner:</small>
                <div className="logo d_flex">
                  <img src={bannerFive} alt="" />
                  <label htmlFor="bannerFive">
                    <i
                      onChange={uploadBannerFiveHandler}
                      className="fa-solid fa-upload"
                    ></i>
                    <input
                      type="file"
                      onChange={uploadBannerFiveHandler}
                      id="bannerFive"
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <small>your ads link here:</small>
                <br />
                <input
                  type="text"
                  value={bannerLinkFive}
                  onChange={(e) => setBannerLinkFive(e.target.value)}
                  placeholder="https://ads.advertise.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                />
              </div>
            </div>
            <div className="submit_btn">
              <button>Update All</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Advert;
