import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { formatPhoneNumber } from 'react-phone-number-input';
import Button from "react-bootstrap/Button";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

// function to render the collapsable rows in the table
function Row(props) {
  const { row } = props;
  const { skills } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const history = useHistory();
  const dispatch = useDispatch();
 
// function to render the user's skills to the user table
  function skillsFunction(skills, row) {
    let array = '';
    for(let i = 0; i < skills.length; i++) {
      if(skills[i].user_id === row.id) {
        array = array += ` •` + skills[i].description + '\n';
      }
    }
    if(array == []) {
      return <p>No skills added.</p>
    }
    else { return (array); }
  }

 //function to open and populate the edit user modal 
  function handleClick(row) {
    history.push("/editUserModal");
    dispatch( {type: 'EDIT_USER', payload: row} );
  }

// function to render the role name based on a user's role number
  function checkRole(row) {
    if(row.role === 3) {
      return 'Admin';
    }
    else if(row.role === 2) {
      return 'Volunteer';
    }
    else if(row.role === 1) {
      return 'User';
    }
    else if(row.role === 0) {
      return 'Interested in Volunteering';
    }
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className="dropdowndata">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell  className="dropdowndata" component="th" scope="row">
          {row.username}
        </TableCell>
        <TableCell className="dropdowndata">{checkRole(row)}</TableCell>
        <TableCell className="dropdowndata" align="right">{row.first_name}</TableCell>
        <TableCell className="dropdowndata" align="right">{row.last_name}</TableCell>
        <TableCell className="dropdowndata" align="right">{row.address}</TableCell>
        <TableCell className="dropdowndata" align="right">{row.email}</TableCell>
        <TableCell className="dropdowndata" align="right">{formatPhoneNumber(row.phone)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="dropdowndata" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Incident Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className="dropdown">
                    <TableCell>Is the user an adult?</TableCell>
                    <TableCell>Is the user on patrol?</TableCell>
                    <TableCell>Is the user on call?</TableCell>
                    <TableCell >User Skills</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow className="dropdowndata" key={row.id}>
                    <TableCell component="th" scope="row">
                        <p>
                          {row.adult.toString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>
                            {row.on_patrol.toString()}
                        </p>
                      </TableCell>
                      <TableCell>
                          <p>
                             {row.on_call.toString()} 
                          </p>
                      </TableCell>
                      <TableCell>
                          <p>
                              {skillsFunction(skills, row)}
                          </p>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleClick(row)}>
                            Edit User
                        </Button>
                    </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function EditUserTable(props) {
  const dispatch = useDispatch();

  return (
    <TableContainer component={Paper}>
        {console.log('callData', props)}
      <Table  className="blackdrop" aria-label="collapsible table">
        <TableHead>
          <TableRow className="dropdown">
            <TableCell />
            <TableCell onClick={() => dispatch( {type: 'SORT_USERNAME'})}>Username</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_ROLE'})}>Role</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_FIRST_NAME'})} align="right">First&nbsp;Name</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_LAST_NAME'})} align="right">Last&nbsp;Name</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_ADDRESS'})} align="right">Address</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_EMAIL'})} align="right">Email</TableCell>
            <TableCell onClick={() => dispatch( {type: 'SORT_PHONE'})} align="right">Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.user.map((user) => (
            <Row key={user.id} row={user} skills={props.skills}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
