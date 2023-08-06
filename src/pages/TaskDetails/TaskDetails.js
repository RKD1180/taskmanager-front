import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Box,
  TextField,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { apiRequest } from "../../interceptor/apiUtils";
import { getUser } from "../../components/Helper/getUser";
import { useForm } from "react-hook-form";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import CardOverflow from "@mui/joy/CardOverflow";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [assigneeUser, setAssigneeUser] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getTask = useCallback(() => {
    apiRequest("get", `/task/${id}`)
      .then((res) => {
        if (res?.data) {
          setTask(res.data);
          setComments(res.data?.comments.reverse());
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  }, [id, setTask]);

  const getUsers = useCallback(() => {
    apiRequest("get", `/user`)
      .then((res) => {
        if (res?.data) {
          setUsers(res.data);
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
    getTask();
    getUsers();
  }, [getTask, getUsers]);

  const onSubmit = (data) => {
    data = { ...data, createdBy: { name: user?.username, id: user?._id } };
    apiRequest("post", `/task/comment/${id}`, data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getTask();
          reset();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error fetching data:", err);
      });
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const unique = value.filter((user) => !task.assignTo.some((newUser) => newUser._id === user._id));
    setAssigneeUser([...unique]);
  };

  const getColor = () => {
    const red = Math.floor(Math.random() * 50);
    const green = Math.floor(Math.random() * 50);
    const blue = Math.floor(Math.random() * 206) + 50;

    const colorCode = `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

    return colorCode;
  };

  const onAssignUserSubmit = () => {
    const data = { users: assigneeUser };
    apiRequest("post", `/task/${id}`, data)
      .then((res) => {
        if (res?.data) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getTask();
          setAssigneeUser([]);
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>ID: </h3>
              <span style={{ textTransform: "capitalize" }}>{task?._id}</span>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>Title: </h3>
              <span>{task?.title}</span>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>Description: </h3>
              <span>{task?.description}</span>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>Due Date: </h3>
              <span>{task?.endDate}</span>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>Created By: </h3>
              <span>{task?.createdBy?.name}</span>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={2}
            >
              <h3>Status: </h3>
              <span style={{ textTransform: "capitalize" }}>
                {task?.status}
              </span>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Box display="flex" alignItems="center" gap={3}>
            <h3>Assign To</h3>
            <Button variant="contained" onClick={handleOpen}>
              Assign User
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {task?.assignTo.map((value,chiIdx) => (
              <Chip key={chiIdx} label={value.username} />
            ))}
          </Box>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  {...register("comment", { required: true })}
                  label="Comment"
                  variant="outlined"
                  placeholder="Type Comment"
                  multiline
                  rows={2}
                  maxRows={4}
                />
                {errors.comment?.type === "required" && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Comment is required!
                  </Alert>
                )}
              </Box>
              <Button type="submit" sx={{ mt: 2, mb: 2 }} variant="contained">
                Comment
              </Button>
            </form>
            <h2>Comments </h2>
            {comments?.map((cmn, idx) => (
              <Card
                key={idx}
                orientation="horizontal"
                variant="outlined"
                fullWidth
                sx={{ mb: 2, mt: 2 }}
              >
                <CardOverflow>
                  <AspectRatio ratio="1" sx={{ width: 90 }}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        style={{ backgroundColor: `${getColor()}` }}
                        alt={cmn?.createdBy?.name}
                        src="/broken-image.jpg"
                      >
                        {cmn?.createdBy?.name?.charAt(0)}
                      </Avatar>
                    </Stack>
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography
                    fontWeight="md"
                    textColor="success.plainColor"
                    mb={0.5}
                  >
                    {cmn?.createdBy?.name}
                  </Typography>
                  <Typography level="body-sm">{cmn?.comment}</Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ mb: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Find User
          </Typography>
          <FormControl
            sx={{ m: 1, width: 300 }}
            onSubmit={handleSubmit(onAssignUserSubmit)}
          >
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={assigneeUser}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value,valueIdx) => (
                    <Chip key={valueIdx} label={value.username} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((item, inde) => (
                <MenuItem key={inde} value={item}>
                  <Checkbox checked={assigneeUser.indexOf(item?._id) > -1} />
                  <ListItemText primary={item?.username} />
                </MenuItem>
              ))}
            </Select>
            <Button
              onClick={() => onAssignUserSubmit()}
              sx={{ mt: 2, mb: 2 }}
              variant="contained"
            >
              Assign
            </Button>
          </FormControl>
        </Box>
      </Modal>

      <ToastContainer autoClose={3000} />
    </Container>
  );
};

export default TaskDetails;
