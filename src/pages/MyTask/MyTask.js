import React, { useCallback, useEffect, useState } from "react";
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
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../interceptor/apiUtils";
import { getUser } from "../../components/Helper/getUser";
import StatusDropdown from "../../components/InputComponents/StatusDropdown";
import FilterListIcon from "@mui/icons-material/FilterList";
import Menu from "@mui/material/Menu";

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

const MyTask = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getMyTasks = useCallback(() => {
    const data = getUser();
    apiRequest("get", `/task/assignto/${data?._id}`)
      .then((res) => {
        if (res?.data) {
          setTasks(res.data);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  }, []);

  useEffect(() => {
    setUser(getUser());
    getMyTasks();
  }, [getMyTasks]);

  const onSubmit = (data) => {
    data = { ...data, createdBy: { name: user?.username, id: user?._id } };
    apiRequest("post", "/task", data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getMyTasks();
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

  const updateTask = (data, id) => {
    apiRequest("put", `/task/${id}`, data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getMyTasks();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  };

  const changeStatus = (value, id) => {
    const data = { status: value };
    updateTask(data, id);
  };

  const detailsView = (id) => {
    navigate(`/task/${id}`);
  };

  const editTask = (id) => {
    navigate(`/edit/${id}`);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterBy = (value) => {
    if (value !== "all") {
      apiRequest("get", `/task/filter/${user?._id}/${value}`)
        .then((res) => {
          if (res?.data) {
            setTasks(res.data);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
          console.error("Error fetching data:", err);
        });
      return;
    }
    getMyTasks();
  };

  return (
    <>
      <h2>My Task</h2>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
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
        <h3>Total Task: {tasks.length}</h3>
        <Button
          display="flex"
          items="center"
          color="warning"
          variant="outline"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <FilterListIcon />
          Filter By Status
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => filterBy("all")}>All</MenuItem>
          <MenuItem onClick={() => filterBy("open")}>Open</MenuItem>
          <MenuItem onClick={() => filterBy("inprogress")}>Inprogress</MenuItem>
          <MenuItem onClick={() => filterBy("completed")}>Complete</MenuItem>
          <MenuItem onClick={() => filterBy("rejected")}>Rejected</MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell align="right">Created By</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="center">Status</TableCell>
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
                <TableCell align="right">
                  <Box sx={{ m: 1, minWidth: 120 }}>
                    <StatusDropdown
                      value={row?.status}
                      onChange={(e) => changeStatus(e.target.value, row?._id)}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="end">
                    <PreviewIcon
                      onClick={() => detailsView(row?._id)}
                      color="success"
                      sx={{ fontSize: 30, cursor: "pointer" }}
                    />
                    <EditIcon
                      onClick={() => editTask(row?._id)}
                      color="primary"
                      sx={{ fontSize: 30, cursor: "pointer" }}
                    />
                  </Box>
                </TableCell>
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

export default MyTask;
