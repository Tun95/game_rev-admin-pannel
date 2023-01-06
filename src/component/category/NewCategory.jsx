import React, { useContext } from "react";
import { useState } from "react";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/Utils";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Context } from "../../context/Context";
import { request } from "../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function NewCategory() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Context);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [category, setCategory] = useState("");

  //==============
  //CREATE CATEGORY
  //==============
  const createHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Category input field is empty", {
        position: "bottom-center",
      });
    } else {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          `${request}/api/category`,
          {
            category,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "CREATE_SUCCESS", payload: data });
        toast.success("Category created successfully", {
          position: "bottom-center",
        });
        navigate(`/category`);
      } catch (err) {
        dispatch({ type: "CREATE_FAIL" });
        toast.error(getError(err), { position: "bottom-center" });
      }
    }
  };

  return (
    <div className="cate_edit">
      <Helmet>
        <title>New Category</title>
      </Helmet>
      <div className="cate_box">
        <form action="" onSubmit={createHandler} className="input_box">
          <h1>Add New Category</h1>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            placeholder="category e.g shooting"
          />
          <br />
          <button className="create_cat_btn">Create</button>
        </form>
      </div>
    </div>
  );
}

export default NewCategory;
