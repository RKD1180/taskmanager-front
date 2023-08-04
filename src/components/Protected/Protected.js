import React from "react";
import { Navigate } from "react-router-dom";

const Protected = ({ isSignedIn, children }) => {
    const data = localStorage.getItem("user");
    const user = JSON.parse(data);
  if (user?._id === null || user?._id === undefined) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default Protected;
