import React, { useEffect } from "react";
import { Box, Button, TextField, Typography, Alert, Container } from "@mui/material";
import { apiRequest } from "../../interceptor/apiUtils";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {  useNavigate, useParams } from "react-router-dom";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const EditTask = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate()

  const getTask = () => {
    apiRequest("get", `/task/${id}`)
      .then((res) => {
        if (res?.data) {
          setValue(res.data);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    getTask();
  }, []);

  const setValue = (task) => {
    const defaultValues = {
      title: task.title,
      description: task.description,
      endDate: task.endDate,
    };
    reset({ ...defaultValues });
  };

  const onSubmit = (data) => {
    data = { ...data };
    apiRequest("put", `/task/${id}`, data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate(-1);
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
    <Container>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          Text in a modal
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <TextField
              fullWidth
              id="outlined-basic"
              focused
              {...register("title", { required: true })}
              label="Task Name"
              variant="outlined"
            />
            {errors.title?.type === "required" && (
              <Alert severity="error">Title is required!</Alert>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              id="outlined-basic"
              focused
              {...register("description", { required: true })}
              label="Description"
              variant="outlined"
              placeholder="Description"
              multiline
              rows={2}
              maxRows={4}
            />
            {errors.description?.type === "required" && (
              <Alert severity="error">Description is required!</Alert>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              focused
              fullWidth
              {...register("endDate", { required: true })}
              type="date"
              id="outlined-basic"
            />
            {errors.endDate?.type === "required" && (
              <Alert severity="error">End Date is required!</Alert>
            )}
          </Box>
          <Button type="submit" sx={{ mt: 2, mb: 2 }} variant="contained">
            Update Task
          </Button>
        </form>
      </Box>
      <ToastContainer autoClose={3000} />
    </Container>
  );
};

export default EditTask;
