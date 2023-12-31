import {
  Button,
  Container,
  Paper,
  Grid,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../../interceptor/apiUtils";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    apiRequest("post", "/user", data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ m: 3 }}
        alignItems="center"
        display="flex"
        justifyContent="center"
      >
        <Grid container spacing={0} alignItems="center" justifyContent="center">
          <Grid item xs={10}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                  type="text"
                  {...register("username", { required: true })}
                  id="outlined-basic"
                  label="User Name"
                  variant="outlined"
                  required
                  fullWidth
                />
                {errors.email?.type === "required" && (
                  <Alert severity="error">Email is required!</Alert>
                )}
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                  type="email"
                  {...register("email", { required: true })}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  required
                  fullWidth
                />
                {errors.email?.type === "required" && (
                  <Alert severity="error">Email is required!</Alert>
                )}
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                  id="outlined-basic"
                  type="password"
                  label="Password"
                  {...register("password", { required: true })}
                  required
                  variant="outlined"
                  fullWidth
                />
                {errors.Password?.type === "required" && (
                  <Alert severity="error">Email is required!</Alert>
                )}
              </Box>
              <Button type="submit" sx={{ mt: 2, mb: 2 }} variant="contained">
                Submit
              </Button>
            </form>
            <p>
              Existing User <Link to={"/"}>Login</Link> here
            </p>
          </Grid>
        </Grid>
      </Paper>
      <ToastContainer autoClose={3000} />
    </Container>
  );
};

export default SignUp;
