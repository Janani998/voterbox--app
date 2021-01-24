import React,{Component} from 'react'
import axios from 'axios'
import InitialHeader from '../InitialHeader/InitialHeader';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

class ForgotPassword extends Component{
    constructor(){
        super();
        this.state = {
            email : '',
            showError : false,
            messageFromServer : '',
            error : '',
            success : false,
            message : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSucesssClose = this.handleSucesssClose.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name] : event.target.value,
            error : ''
        });
    }

    handleClose(){
        this.props.history.push("/signup");
    }

    handleNext(){
        this.setState({showError : false,
            messageFromServer : '',
            error : '',
        });
    }

    handleSucesssClose(){
        this.setState({success : false,
            showError : false,
            error : ''
        })
    }

    sendEmail(event){
        event.preventDefault();
        const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(this.state.email === ''){
            this.setState({
                error : "Email ID cannot be null",
                showError : false,
                messageFromServer : ''
            })
            return;
        }else if(!(emailReg.test(this.state.email))){
            this.setState({error : "Enter valid Email ID"});
            return;
        }
        else{
            this.setState({message : true})
            axios.post('http://localhost:8080/users/forgotPassword',{
                email : this.state.email
            })
            .then(response =>{
                console.log(response.data);
                if(response.data.msg === 'email not present in db'){
                    this.setState({
                        showError : true,
                        messageFromServer : '',
                        message : false
                    })
                }else if(response.status === 200){
                    this.setState({
                        showError : false,
                        success : true,
                        message : false,
                        messageFromServer : 'recovery email sent'
                    })
                }
            })
            .catch(err =>{
                if(err){
                    this.setState({error : err.response.data.msg})
                }
            })
        }
    }

    render(){
        const {email, messageFromServer, showError,error,success,message} = this.state;
        return(
            <>
            <InitialHeader title = "Forgot Password - VoterBox"/>
            <div className = "container">
                <div className = "loginContainer">
                <Typography variant="h4" component="h1" style = {{marginBottom : "80px"}} >Forgot Password</Typography>
                <TextField label="Enter Email" name = "email" fullWidth variant ="outlined" value ={email} margin = 'normal' onChange ={this.handleChange} />
                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error} <strong>check it out!</strong>
                    </Alert>
                )}
                <Button variant="contained" color="primary" onClick ={this.sendEmail} >Send Email</Button>
                {message && (
                    <Alert>
                        Please wait sending mail to your account
                    </Alert>
                )}
            </div>
            </div>
            {showError && (
                <Dialog
                open={showError}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <Typography color = "error" variant="h6" component="h6">
                    That email address isn't recognized. Please try again or register for a new account.
                </Typography>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    Create new Account
                </Button>
                <Button color="primary" onClick = {this.handleNext}>
                    Try Again
                </Button>
                </DialogActions>
            </Dialog>
            )}
            {messageFromServer === 'recovery email sent' && (
                <Dialog
                open={success}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <Typography color = "error" variant="h6" component="h6">
                    Password Reset Email Sucessfully sent!
                </Typography>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleSucesssClose} color="primary">
                    OK
                </Button>
                </DialogActions>
            </Dialog>
            )}
            </>
        );
    }
}

export default ForgotPassword;