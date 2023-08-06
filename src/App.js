import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./components/DashBoard/Layout/Layout";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Protected from "./components/Protected/Protected";
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import MyTask from "./pages/MyTask/MyTask";
import EditTask from "./pages/EditTask/EditTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/mytasks" element={<MyTask />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
