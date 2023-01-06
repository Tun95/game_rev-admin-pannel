import React from "react";
import "./styles.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useReducer } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { toast } from "react-toastify";
import { getError } from "../../utils/Utils";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, post: action.payload };
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

function CategoryEdit() {
  const [{ loading, error, post, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const { state } = useContext(Context);
  const { userInfo } = state;

  const params = useParams();
  const { id: catId } = params;

  //==============
  //FETCH CATEGORY
  //==============
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/category/${catId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategory(data.category);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    fetchData();
  }, [catId, userInfo]);

  //=================
  // UPDATE CATEGORY
  //=================
  const updateHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Category input field is empty", {
        position: "bottom-center",
      });
    } else {
      try {
        dispatch({ type: "UPDATE_REQUEST" });
        await axios.put(
          `/api/category/${catId}`,
          {
            category,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Category updated successfully", {
          position: "bottom-center",
        });
        navigate("/category");
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      }
    }
  };

  return (
    <div className="cate_edit">
      <Helmet>
        <title>Category Update</title>
      </Helmet>
      <div className="cate_box">
        <div className="create_btn">
          <Link to="/new-category">
            <i className="fa-solid fa-square-plus"></i>
          </Link>
        </div>
        <form action="" onSubmit={updateHandler} className="input_box">
          <h1>Update Category</h1>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            placeholder="category e.g shooting"
          />
          <br />
          <button>Update</button>
        </form>
      </div>
    </div>
  );
}

export default CategoryEdit;
