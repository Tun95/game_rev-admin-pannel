import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from "./screens/dashboard/Dashboard";
import { useState } from "react";
import Post from "./screens/posts/Post";
import Nav from "./common/nav bar/Nav";
import SideBar from "./common/side bar/SideBar";
import Category from "./screens/category/Category";
import User from "./screens/users/User";
import PostDetails from "./screens/posts/PostDetails";
import New from "./screens/posts/New";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryUpdate from "./screens/category/CategoryUpdate";
import AddCategory from "./screens/category/AddCategory";
import Login from "./screens/form/Login";
import { useContext } from "react";
import { Context } from "./context/Context";
import Settings from "./screens/settings/Settings";
import UserDetails from "./screens/users/UserDetails";
import PostComment from "./screens/posts/PostComment";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Subscribers from "./screens/subscribers/Subscribers";
import Advertise from "./screens/manage ads/Advertise";
import Register from "./screens/form/Register";

function App() {
  const { state } = useContext(Context);
  const { userInfo } = state;


  return (
    <div className="App">
      <Router>
        <ToastContainer />
        <div className="container_flex">
          {!userInfo ? "" : <SideBar />}
          <div className={"main active"}>
            {!userInfo ? "" : <Nav />}
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              ></Route>
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/register" element={<Register />}></Route>

              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/post/:id"
                element={
                  <ProtectedRoute>
                    <PostDetails />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/new-post"
                element={
                  <ProtectedRoute>
                    <New />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/post-comment/:id"
                element={
                  <ProtectedRoute>
                    <PostComment />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <User />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/update_user/:id"
                element={
                  <ProtectedRoute>
                    <UserDetails />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/category"
                element={
                  <ProtectedRoute>
                    <Category />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/category/:id"
                element={
                  <ProtectedRoute>
                    <CategoryUpdate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/new-category"
                element={
                  <ProtectedRoute>
                    <AddCategory />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/subscriber"
                element={
                  <ProtectedRoute>
                    <Subscribers />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/advertise/:id"
                element={
                  <ProtectedRoute>
                    <Advertise />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/settings/:id"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
