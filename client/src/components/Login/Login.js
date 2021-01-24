import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import "./Login.css";
import axios from 'axios'
import { Alert, AlertTitle } from '@material-ui/lab';
import InitialHeader from '../InitialHeader/InitialHeader';

class Login extends Component{
    constructor(){
        super();
        this.state = {
            email : "",
            password : "",
            error : "",
            succes : "",
            loading : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.validate = this.validate.bind(this);

    }


    handleChange(event){
        this.setState({[event.target.name] : event.target.value});
        this.setState({error : ""});
    }

    validate(){
        const email = this.state.email;
        const password = this.state.password;
        const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; 
        const passwordReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if(!email || !password){
            this.setState({error : "All fields are mandatory"});
            return;
        }
        if(!(emailReg.test(email))){
            this.setState({error : "Enter valid Email"});
            return;
        }
        if(!(passwordReg.test(password))){
            this.setState({error : "Enter valid password"});
            return;
        }
        return true;
    }

    handleLogin(){
        this.setState({loading : true})
        const {email,password} = this.state;
        if(this.validate()){
            axios.post('http://localhost:8080/users/login', {
                email,
                password
              })
              .then((response) =>{
                if(response.status === 200){
                    window.localStorage.setItem('login',JSON.stringify(response.data));
                    this.setState({loading : false})
                    this.props.history.push('/home');
                }
              })
              .catch((err) => {
                if(err){
                    this.setState({error : err.response.data.msg,
                        loading : false
                    })
                }
              });
        }
        else{
            this.setState({loading : false})
        }
    }

    render(){
        const {email,password,error,loading} = this.state;
        return(
            <>
            <InitialHeader title = "Login - VoterBox"/>
            <div className = "container">
                <div className = "loginContainer">
                <Typography variant="h3" component="h1">Login</Typography>
                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error} <strong>check it out!</strong>
                    </Alert>
                )}
                    <div className = "inputContainer">
                        <TextField label="Enter Email" variant="outlined"  name = "email" margin = 'normal' value = {email} onChange = {this.handleChange} />
                        <TextField type = "password" label="Enter Password" variant="outlined"  name ="password" margin = 'normal' value = {password} onChange = {this.handleChange} />
                    </div>
                    <div className = "firstSection">
                        <Link to= "/forgotPassword" style={{ textDecoration: 'none'}}>
                        <div className ="forgot" >Forgot Password ?</div>
                        </Link>
                    </div>
                    <Button variant="contained" color="primary" margin = 'normal'  onClick ={this.handleLogin}>Login</Button>
                    <div className = "secondSection">Don't have a account<Link to= "/signup">Sign Up</Link></div>
                </div>
                    <Dialog
                        open={loading}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"LoggingIn..."}</DialogTitle>
                        <DialogContent>
                            <CircularProgress />
                        </DialogContent>
                    </Dialog>
            </div>
        </>
        );
    }
}

export default Login;