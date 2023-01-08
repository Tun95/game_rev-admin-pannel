import React, { useContext, useEffect, useReducer } from "react";
import "./styles.scss";
import JoditEditor from "jodit-react";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
import { getError } from "../../utils/Utils";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import photo from "../../asset/photo.png";
import banner1 from "../../asset/banner.png";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, post: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_CATEGORY_REQUEST":
      return { ...state, loadingCategory: true };
    case "FETCH_CATEGORY_SUCCESS":
      return { ...state, loadingCategory: false, categories: action.payload };
    case "FETCH_CATEGORY_FAIL":
      return { ...state, loadingCategory: false, error: action.payload };

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
function PostEdit() {
  const [{ loading, error, post, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();

  const { state } = useContext(Context);
  const { userInfo } = state;

  const params = useParams();
  const { id: postId } = params;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState([]);
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [banner, setBanner] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [buyLink, setBuyLink] = useState("");

  //=================
  //POST FETCHING
  //=================
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${request}/api/posts/admin/${postId}`
        );
        setTitle(data.title);
        setSlug(data.slug);
        setCategory(data.category);
        setImage(data.image);
        setImages(data.images);
        setBanner(data.banner);
        setShortDesc(data.shortDesc);
        setDownloadLink(data.downloadLink);
        setDescription(data.description);
        setBuyLink(data.buyLink)
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [postId, userInfo]);

  //==============
  //FETCH CATEGORY HANDLER
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_CATEGORY_REQUEST" });
        const { data } = await axios.get(`${request}/api/category/alphatical`);
        dispatch({ type: "FETCH_CATEGORY_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_CATEGORY_FAIL" });
      }
    };

    fetchData();
  }, []);
  console.log(categories);

  //=================
  // UPDATING POST
  //=================
  const Msg = ({ closeToast, toastProps }) => (
    <div>
      The following fields{" "}
      <span className="starField">
        " <span id="starField">*</span> "
      </span>{" "}
      are required
    </div>
  );

  const updateHandler = async (e) => {
    e.preventDefault();
    if (!title || !slug || !shortDesc || !description || !downloadLink) {
      toast.error(<Msg />, {
        position: "bottom-center",
      });
    } else {
      try {
        dispatch({ type: "UPDATE_REQUEST" });
        await axios.put(
          `${request}/api/posts/${postId}`,
          {
            id: postId,
            title,
            slug,
            category,
            image,
            images,
            banner,
            shortDesc,
            description,
            downloadLink,
            buyLink
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Post updated successfully", {
          position: "bottom-center",
        });
        navigate("/posts");
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      }
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success("Image uploaded successfully. Click update to apply it", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  // BANNER UPLOAD
  //=================
  const uploadImagesHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Banner uploaded successfully", {
        position: "bottom-center",
      });
      setBanner(data.secure_url);
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  //=================
  //DELETE IMAGES
  //=================
  const deleteFileHandler = async (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. Click update to apply it", {
      position: "bottom-center",
    });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 210,
      },
    },
  };

  const editor = useRef(null);

  return (
    <div className="post_edit">
      <Helmet>
        <title>Edit Posts</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div className="post_edit_box">
          <form action="" onSubmit={updateHandler} className="sections">
            <div className="section_1 d_grid">
              <div className="cards box_1 top">
                <div className="image">
                  <label htmlFor="image">Image (250 x 250)px</label>
                  <div className="img">
                    <img src={image || photo} alt="post_image" />
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
                </div>
                <div className="edit_btn">
                  <Link to="/new-post">
                    <i className="fa-solid fa-square-plus"></i>
                  </Link>
                </div>
              </div>
              <div className="cards box_2 top">
                <label htmlFor="image">Banner (308 x 110)px</label>
                <div className="img">
                  <img src={banner || banner1} alt="banner" />
                  <label htmlFor="banner">
                    <i
                      onChange={uploadImagesHandler}
                      className="fa-solid fa-arrow-up-from-bracket"
                    ></i>
                  </label>
                  <input
                    onChange={uploadImagesHandler}
                    type="file"
                    id="banner"
                    style={{ display: "none" }}
                  />
                </div>
                <label htmlFor="title" className="top_input">
                  Title<span className="star">*</span>:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="title e.g GTA San Andreas"
                />
                <label htmlFor="slug" className="top_input">
                  Slug<span className="star">*</span>:
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug e.g GTA-San-Andreas"
                />
              </div>
            </div>
            <div className="section_2">
              <div className="cards">
                <div className="input_form">
                  <label htmlFor="category">Category:</label>
                  <FormControl variant="filled" size="small" id="formControl">
                    {/* <InputLabel id="mui-simple-select-label">
                        Category
                      </InputLabel> */}
                    <Select
                      labelId="mui-simple-select-label"
                      id="mui-simple-select"
                      multiple
                      MenuProps={MenuProps}
                      SelectDisplayProps={{
                        style: { paddingTop: 8, paddingBottom: 8 },
                      }}
                      value={category || ""}
                      label={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories?.map((c, index) => (
                        <MenuItem key={index} value={c.category}>
                          {c.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="input_form input_lower">
                  <label htmlFor="short_desc" className="top_input">
                    Short Descriton<span className="star">*</span>:
                  </label>
                  <input
                    type="text"
                    id="short_desc"
                    maxLength={132}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="short description on your post"
                  />
                </div>
                <div className="desc_box">
                  <label htmlFor="desc">
                    Description<span className="star">*</span>:
                  </label>
                  <JoditEditor
                    className="editor"
                    id="desc"
                    ref={editor}
                    value={description}
                    // config={config}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {}}
                  />
                </div>
                <div className="lower_section_2">
                  <div className="grid_layout">
                    <label htmlFor="download" className="top_input">
                      App Download Link<span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      id="download"
                      value={downloadLink}
                      onChange={(e) => setDownloadLink(e.target.value)}
                      placeholder="App download link"
                    />
                  </div>
                  <div className="grid_layout">
                    <label htmlFor="download" className="top_input">
                      App Buy Now Link
                    </label>
                    <input
                      type="text"
                      id="download"
                      value={buyLink}
                      onChange={(e) => setBuyLink(e.target.value)}
                      placeholder="App buy now link"
                    />
                  </div>
                  <div className="grid_layout">
                    <div className="label_upload">
                      <label htmlFor="">
                        Upload your description images here
                      </label>
                      <label htmlFor="link">
                        <i
                          onChange={(e) => uploadFileHandler(e, true)}
                          className="fa-solid fa-upload"
                        ></i>
                        <input
                          type="file"
                          onChange={(e) => uploadFileHandler(e, true)}
                          name=""
                          id="link"
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                    <div className="grid_map">
                      <div className="image_link">
                        {images.map((x) => (
                          <div key={x} className="images d_flex">
                            <img src={x} alt="" />
                            <input
                              type="text"
                              value={x}
                              placeholder="image link"
                            />
                            <i
                              onClick={() => deleteFileHandler(x)}
                              className="fa-solid fa-trash-can"
                            ></i>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="info">
                      <small>
                        Copy the image link here and insert it to your post
                      </small>
                    </div>
                  </div>
                  <div className="btn_buttom">
                    <button className="update" type="submit">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostEdit;
