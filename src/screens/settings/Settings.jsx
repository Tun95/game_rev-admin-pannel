import React from "react";
import { useRef } from "react";
import { useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.scss";
import { useReducer } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/Utils";
import { useContext } from "react";
import { Context } from "../../context/Context";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { Helmet } from "react-helmet-async";
import { request } from "../../../../frontend/src/base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, settings: action.payload };
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

const URL = request;
function Settings() {
  const [{ loading, error, successUpdate, settings }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const editor = useRef(null);
  const [about, setAbout] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [contact, setContact] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [gameErr, setGameErr] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [logo, setLogo] = useState("");
  const [request, setRequest] = useState("");
  const [copyRight, setCopyRight] = useState("");
  const [downLoadPage, setDownLoadPage] = useState("");
  const [downLoadPageInfo, setDownLoadPageInfo] = useState("");
  const [background, setBackground] = useState("");
  const [disqus, setDisqus] = useState("");
  const [dmca, setDmca] = useState("");
  const params = useParams();
  const { id: setId } = params;

  const { state } = useContext(Context);
  const { userInfo } = state;

  //===============
  //FETCH CATEGORY
  //===============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${URL}/api/settings/${setId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setAbout(data.about);
        setPrivacy(data.privacy);
        setContact(data.contact);
        setDisclaimer(data.disclaimer);
        setGameErr(data.gameErr);
        setFacebook(data.facebook);
        setTwitter(data.twitter);
        setInstagram(data.instagram);
        setLogo(data.logo);
        setRequest(data.request);
        setCopyRight(data.copyRight);
        setDownLoadPage(data.downLoadPage);
        setDownLoadPageInfo(data.downLoadPageInfo);
        setBackground(data.background);
        setDisqus(data.disqus);
        setDmca(data.dmca);
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
  }, [setId, successUpdate, userInfo]);

  //=================
  // UPDATING SETTINGS
  //=================
  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${URL}/api/settings/${setId}`,
        {
          about,
          privacy,
          contact,
          disclaimer,
          gameErr,
          facebook,
          twitter,
          instagram,
          logo,
          request,
          copyRight,
          downLoadPage,
          downLoadPageInfo,
          background,
          disqus,
          dmca,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Settings updated successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
    }
  };

  //=================
  // LOGO UPLOAD
  //=================
  const uploadLogoHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${URL}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Logo uploaded successfully", {
        position: "bottom-center",
      });
      setLogo(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // BACKGROUND UPLOAD
  //=================
  const uploadBackgroundHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${URL}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBackground(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <div className="settings">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <div className="settings_box">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <form action="" onSubmit={updateHandler} className="settings_content">
            <div className="form_box">
              <h3>About:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={about}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setAbout(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="form_box">
              <h3>Privacy:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={privacy}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setPrivacy(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>{" "}
            <div className="form_box">
              <h3>Contact:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={contact}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setContact(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="form_box">
              <h3>Disclaimer:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={disclaimer}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setDisclaimer(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>{" "}
            <div className="form_box">
              <h3>How to Fix Game Errors:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={gameErr}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setGameErr(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="form_box">
              <h3>How to Fix Game Errors:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={request}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setRequest(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="form_box">
              <h3>Download Page:</h3>
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={downLoadPage}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setDownLoadPage(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>{" "}
            <div className="form_box">
              <JoditEditor
                className="editor"
                id="desc"
                ref={editor}
                value={downLoadPageInfo}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setDownLoadPageInfo(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
            </div>
            <div className="form_input ">
              <div className="inner_form">
                <div className="form_group">
                  <div className="hoe"></div>
                  <h4>Your App Background: min(1280x720)</h4>
                  <div className="logo background_image d_flex">
                    <img src={background} alt="background" />
                    <label htmlFor="link">
                      <i
                        onChange={uploadBackgroundHandler}
                        className="fa-solid fa-upload"
                      ></i>
                      <input
                        type="file"
                        onChange={uploadBackgroundHandler}
                        name=""
                        id="link"
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="https://res.cloudinary.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                  />

                  <small>Your App Logo here:</small>
                  <div className="logo d_flex">
                    <img src={logo} alt="" />
                    <label htmlFor="link">
                      <i
                        onChange={uploadLogoHandler}
                        className="fa-solid fa-upload"
                      ></i>
                      <input
                        type="file"
                        onChange={uploadLogoHandler}
                        name=""
                        id="link"
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://res.cloudinary.com/dstj5eqcd/image/upload/v1672751981/banner_biet3l.jpg"
                  />
                </div>
                <div className="from_flex">
                  <div className="inner_inner_form">
                    <div className="form_group">
                      <small>Your Copy Right link here:</small>
                      <input
                        type="text"
                        value={copyRight}
                        onChange={(e) => setCopyRight(e.target.value)}
                        placeholder="https://www.copyrighted.com/"
                      />
                    </div>
                    <div className="form_group">
                      <small>Your DMCA link here:</small>
                      <input
                        type="text"
                        value={dmca}
                        onChange={(e) => setDmca(e.target.value)}
                        placeholder="https://www.dmca.com/"
                      />
                    </div>
                    <div className="form_group">
                      <small>Your Facebook profile page link here:</small>
                      <input
                        type="text"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://web.facebook.com/"
                      />
                    </div>
                    <div className="form_group">
                      <small>Your Twitter profile page link here:</small>
                      <input
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="https://twitter.com/"
                      />
                    </div>
                    <div className="form_group">
                      <small>Your Instagram profile page link here:</small>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://web.facebook.com/"
                      />
                    </div>
                    <div className="form_group">
                      <small>Your disqus shortname here:</small>
                      <input
                        type="text"
                        value={disqus}
                        onChange={(e) => setDisqus(e.target.value)}
                        placeholder="e.g. web-short"
                      />
                    </div>
                  </div>
                  <div className="submit_bn">
                    <button>Update All</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Settings;
