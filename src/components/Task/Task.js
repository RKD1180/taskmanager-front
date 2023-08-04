import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { apiRequest } from "../../interceptor/apiUtils";
import { getUser } from "../Helper/getUser";

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

const Task = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getAllTasks = () => {
    apiRequest("get", "/task")
      .then((res) => {
        if (res?.data) {
          setTasks(res.data.reverse());
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
    setUser(getUser());
    getAllTasks();
  }, []);

  const onSubmit = (data) => {
    data = { ...data, createdBy: { name: user?.username, id: user?._id } };
    apiRequest("post", "/task", data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getAllTasks();
          reset();
          handleCloseModal();
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
    <>
      <Box sx={{ mb: 3 }}>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
        >
          <Button display="flex" items="center" onClick={handleOpenModal}>
            <AddIcon />
            Add Task
          </Button>
        </ButtonGroup>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell align="right">Assignee</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="right">{row?.createdBy?.name}</TableCell>
                <TableCell align="right">{row?.endDate}</TableCell>
                <TableCell align="right">{row?.status}</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
              Add Task
            </Button>
          </form>
        </Box>
      </Modal>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Task;
