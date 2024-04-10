import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { 
  Container,
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
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
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import { useState } from 'react';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



function FormDialog({open, handleClose, isEdit, handleAdd}) {

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
            handleAdd({
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
            ? "Edit Task" 
            : <Stack alignItems="center" direction="row">
                <AddCircleIcon />
                <Typography>Add Task</Typography>
              </Stack>}
        </DialogTitle>
        <DialogContent>
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
          />
          <DatePicker 
            autoFocus
            id="deadline"
            name="deadline"
            label="Deadline"
            variant="outlined"
            sx={{width: "100%", my: "1rem"}}
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
        <DialogActions>
          <Button variant="contained" type="submit"><AddCircleIcon />ADD</Button>
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
    const [isEdit, setIsEdit] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleEdit = () => {
      setIsEdit(true);
    };

    const handleAdd = (task) => {
      setTasks(
        [
          ...tasks,
          task
        ]
      )
      return (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert
             
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            This is a success Alert inside a Snackbar!
          </Alert>
        </Snackbar>
      );
    };

    return (
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuIcon />FRAMEWORKS
              </Typography>
              <Button variant="contained" onClick={handleClickOpen}><AddCircleIcon /> Add</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <FormDialog open={open} handleClose={handleClose} handleAdd={handleAdd} />
      </React.Fragment>
    );
  }
  
  function TaskTable() {
    const checkedRow = {};
    tasks.forEach(task => {
      checkedRow[task.title] = false;
    });
    const [checked, setChecked] = React.useState(checkedRow);
    return (
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
                      ? <Button>DELETE</Button>
                      : <Stack> 
                          <Button variant="contained">
                            <FontAwesomeIcon icon={faPenToSquare} />UPDATE
                          </Button>
                          <Button variant="contained" color="error">
                            <CancelIcon />DELETE
                          </Button>
                        </Stack>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
