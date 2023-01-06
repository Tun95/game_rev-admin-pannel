import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Disqus from "disqus-react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../utils/loading message/LoadingBox";
import MessageBox from "../../utils/loading message/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, post: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function Comment() {
  const params = useParams();
  const { id: postId } = params;

  const [{ loading, error, post }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  //=================
  //POST FETCHING
  //=================
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/posts/${postId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    fetchData();
  }, [postId]);

  const disqusShortname = process.env.REACT_APP_DISQUS_SHORTNAME;
  const disqusConfig = {
    identifier: postId,
    title: post?.title,
  };
  console.log(post);
  return (
    <div className="update_user">
      <Helmet>
        <title>{`Comments: ${post?.title}`}</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div className="update_user_box">
          <h3>{post?.title}</h3>
          <Disqus.DiscussionEmbed
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      )}
    </div>
  );
}

export default Comment;
