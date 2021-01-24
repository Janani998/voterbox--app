import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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

export default function InitialHeader({title}) {
  const classes = useStyles();

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
            <Link to = "/" style={{ textDecoration: 'none', color : "white" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to = "/signup" style={{ textDecoration: 'none', color : "white" }}>
                <Button color="inherit">Signup</Button>
              </Link>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
