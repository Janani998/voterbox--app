import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft : "20px",
    flexGrow: 1,
  },
}));

export default function Header({title}) {
  const classes = useStyles();

  const handleLogout = () =>{
    window.localStorage.removeItem('login');
  }

  return (
    <div className={classes.root}>
      <Helmet>
            <title>{title}</title>
      </Helmet>
      <AppBar position="static">
        <Toolbar>
        <img src = "logo192.png" alt = "" height = "50px" width = "50px"/>
          <Typography variant="h4" className={classes.title}>
            VoterBox
          </Typography>
            <div>
            <Link to = "/profile" style={{ textDecoration: 'none', color : "white" }}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              </Link>
              <Link to = "/" style={{ textDecoration: 'none', color : "white" }}>
                <Button color="inherit" onClick = {handleLogout}>Logout</Button>
              </Link>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
