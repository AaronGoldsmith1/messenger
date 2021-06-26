import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { ImageSideBanner } from './components'
import bgImg from './assets/bg-img.png';
import { login } from "./store/utils/thunkCreators";

const useStyles = makeStyles((theme) => ({
  login: {
    height: '100vh',
  },
  loginForm:{
    width: '50%',
  },
  formElem: {
    width: '100%'
  },
  register: {
    padding: '2rem 3rem 0 0',
    '& p':{
      margin: '1.2rem',
      color: "#B0B0B0",
      fontSize: '1.1em'

    },
    '& button': {
      boxShadow: '0px 8px 16px 0px rgb(0 0 0 / 13%)',
      padding: '1rem 2.5rem'
    }
  },
  submitButton: {
    marginTop: '2rem',
    padding: '1rem 3.5rem',
  },
  formTitle: {
    textAlign: 'left'
  }
}));


const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.login}>
      <CssBaseline />

      <ImageSideBanner bgImg={bgImg}></ImageSideBanner>
      
      <Grid container item direction='row' sm={12} md={7}>
        <Grid container item justify='flex-end' alignItems='flex-start' className={classes.register}>
          <Typography>Dont have an account?</Typography>
          <Button onClick={() => history.push("/register")} size="large" color="primary">Create Account</Button>
        </Grid>

        <Grid container item align='center' justify='center'>
        
        <form onSubmit={handleLogin} className={classes.loginForm}>
          <Typography gutterBottom={true} variant="h4" className={classes.formTitle}>Welcome back!</Typography>
           <Grid>
             <Grid>
               <FormControl margin="normal"  className={classes.formElem}>
                 <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                  required
                />
              </FormControl>
            </Grid>
            <FormControl margin="normal" className={classes.formElem}>
              <TextField
                label="Password"
                aria-label="password"
                type="password"
                name="password"
                required
              />
            </FormControl>
            <Grid>
              <Button  type="submit" variant="contained" color="primary" size="large" className={classes.submitButton}>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
