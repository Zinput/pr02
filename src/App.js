import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'toastr/build/toastr.min.css';
import { 
  Container,
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import { useState } from 'react';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import dayjs from 'dayjs';



function FormDialog({open, handleClose, isEdit, handleAdd, taskToEdit, handleEdit, checkTitle}) {
  const[titleError, setTitleError] = useState(false);
  const[descError, setDescError] = useState(false);
  const[badTitle, setBadTitle] = useState(false);
  const[descModified, setDescModified] = useState(false);
  const[titleModified, setTitleModified] = useState(false);

  const handleDescChange = event => {
    setDescModified(true);
    setDescError(event.target.value);
    if (event.target.validity.valid) {
      setDescError(false);
    } else {
      setDescError(true);
    }
  };

  const handleTitleChange = event => {
    setTitleModified(true);
    setTitleError(event.target.value);
    if (event.target.validity.valid) {
      setTitleError(false);
      if (checkTitle(event.target.value)) {
        setBadTitle(false);
      }
      else {
        setBadTitle(true);
        setTitleError(true);
      }
    } else {
      setTitleError(true);
    }
  };

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            isEdit
            ? handleEdit({
              title: taskToEdit.title,
              description: formJson.description,
              priority: formJson.priority,
              deadline: formJson.deadline,
              isComplete: false
              })
            : handleAdd({
              title: formJson.title,
              description: formJson.description,
              priority: formJson.priority,
              deadline: formJson.deadline,
              isComplete: false
            });
            handleClose();
          },
        }}
      >
        <DialogTitle>
          {isEdit 
            ? <Stack alignItems="center" direction="row">
                <FontAwesomeIcon icon={ faPenToSquare } />
                <Typography>Edit Task</Typography>
              </Stack>
            : <Stack alignItems="center" direction="row">
                <AddCircleIcon />
                <Typography>Add Task</Typography>
              </Stack>}
        </DialogTitle>
        {isEdit
        ? <DialogContent>
            <TextField
              autoFocus
              required
              margin="normal"
              id="description"
              name="description"
              label="Description"
              type="required"
              fullWidth
              variant="outlined"
              defaultValue={taskToEdit.description}
              error={descError}
              helperText={descError ? "Description is Required!" : ""}
              onChange={handleDescChange}
            />
            <DatePicker 
              autoFocus
              required
              id="deadline"
              name="deadline"
              label="Deadline"
              variant="outlined"
              sx={{width: "100%", my: "1rem"}}
              defaultValue={dayjs(taskToEdit.deadline)}
            />
            <FormControl>
              <FormLabel id="priority-label">Priority</FormLabel>
              <RadioGroup
                row
                aria-labelledby="priority-label"
                name="priority"
                defaultValue={taskToEdit.priority}
              >
                <FormControlLabel value="low" control={<Radio />} label="Low" />
                <FormControlLabel value="med" control={<Radio />} label="Med" />
                <FormControlLabel value="high" control={<Radio />} label="High" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
        : <DialogContent>
            <TextField
              autoFocus
              required
              margin="normal"
              id="title"
              name="title"
              label="Title"
              type="required"
              fullWidth
              variant="outlined"
              error={titleError}
              helperText={titleError ? badTitle ? "Title Must be Unique!" : "Title is Required!" : ""}
              onChange={handleTitleChange}
            />
            <TextField
              autoFocus
              required
              margin="normal"
              id="description"
              name="description"
              label="Description"
              type="required"
              fullWidth
              variant="outlined"
              error={descError}
              helperText={descError ? "Description is Required!" : ""}
              onChange={handleDescChange}
            />
            <DatePicker 
              autoFocus
              required
              id="deadline"
              name="deadline"
              label="Deadline"
              variant="outlined"
              sx={{width: "100%", my: "1rem"}}
              defaultValue={dayjs()}
            />
            <FormControl>
              <FormLabel id="priority-label">Priority</FormLabel>
              <RadioGroup
                row
                aria-labelledby="priority-label"
                name="priority"
                defaultValue="low"
              >
                <FormControlLabel value="low" control={<Radio />} label="Low" />
                <FormControlLabel value="med" control={<Radio />} label="Med" />
                <FormControlLabel value="high" control={<Radio />} label="High" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
        }
        <DialogActions>
          {isEdit
          ? <Button variant="contained" type="submit" disabled={descError}><FontAwesomeIcon icon={ faPenToSquare } />EDIT</Button>
          : <Button variant="contained" type="submit" disabled={titleError || descError || !titleModified || !descModified}><AddCircleIcon />ADD</Button>
          }
          <Button variant="contained" color="error" onClick={handleClose}><BlockIcon /> CANCEL</Button>
        </DialogActions>
      </Dialog>
  );
}

function App() {
  function createData(title, description, deadline, priority, isComplete, action) {
    return { title, description, deadline, priority, isComplete, action };
  }

  const [tasks, setTasks] = useState([
    {
      title: "groceries",
      description: "ice cream",
      priority: "high",
      deadline: "04/28/2024",
      isComplete: false
    }
  ]);

  function Banner() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleAdd = (task) => {
      setTasks(
        [
          ...tasks,
          task
        ]
      )
      toastr.options = {
        positionClass : 'toast-bottom-right',
        hideDuration: 300,
        timeOut: 5000
      }
      toastr.clear()
      setTimeout(() => toastr.success("Task added successfully"), 300)
    };

    const checkTitle = (title) => {
      return !tasks.some(task => task.title === title);
    };

    return (
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuIcon style={{position: 'relative', top: '4px'}} />FRAMEWORKS
              </Typography>
              <Button variant="contained" onClick={handleClickOpen} startIcon={<AddCircleIcon />}>Add</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <FormDialog open={open} handleClose={handleClose} handleAdd={handleAdd} checkTitle={checkTitle} />
      </React.Fragment>
    );
  }
  
  function TaskTable() {
    const checkedRow = {};
    tasks.forEach(task => {
      checkedRow[task.title] = false;
    });
    
    const [checked, setChecked] = React.useState(checkedRow);

    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditClose = () => {
      setEditOpen(false);
    };
    const [taskToEdit, setTaskToEdit] = React.useState({});

    const handleDelete = (taskToDelete) => {
      let tempTaskList = tasks.slice();
      const start = tempTaskList.indexOf(task => (task.title === taskToDelete));
      const deleteCount = 1;
      tempTaskList.splice(start, deleteCount);
      setTasks(tempTaskList);

      toastr.options = {
        positionClass : 'toast-bottom-right',
        hideDuration: 300,
        timeOut: 5000
      }
      toastr.clear()
      setTimeout(() => toastr.success("Task deleted successfully"), 300)
    };
    
    const openEditForm = (taskToEdit) => {
      setTaskToEdit(taskToEdit);
      setEditOpen(true);
    };

    const handleEdit = (editedTask) => {
      let tempTaskList = tasks.slice();
      const index = tempTaskList.findIndex(task => (task.title === taskToEdit.title));
      tempTaskList[index] = editedTask;
      setTasks(tempTaskList);

      toastr.options = {
        positionClass : 'toast-bottom-right',
        hideDuration: 300,
        timeOut: 5000
      }
      toastr.clear()
      setTimeout(() => toastr.success("Task edited successfully"), 300)
    };

    return (
      <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Is Complete</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((row) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.deadline}</TableCell>
                <TableCell align="center">{row.priority}</TableCell>
                <TableCell align="center">
                  {<Checkbox
                    onChange={(event, isRowChecked) => {
                      let tempChecked = {...checked};
                      tempChecked[row.title] = isRowChecked;
                      setChecked(tempChecked);
                    }}
                  />}
                </TableCell>
                <TableCell align="center">
                  {
                    checked[row.title] 
                      ? <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => handleDelete(row.title)}>
                          DELETE
                        </Button>
                      : <Box sx={{display: 'inline-flex'}}>
                          <Stack> 
                            <Button variant="contained" startIcon={<FontAwesomeIcon icon={faPenToSquare} />} onClick={() => openEditForm(row)}>
                              UPDATE
                            </Button>
                            <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => handleDelete(row.title)}>
                              DELETE
                            </Button>
                          </Stack>
                        </Box>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog open={editOpen} handleClose={handleEditClose} isEdit={true} taskToEdit={taskToEdit} handleEdit={handleEdit}/>
      </>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Banner />
        <TaskTable />
      </Container>
    </LocalizationProvider>
  );  
}

export default App;
