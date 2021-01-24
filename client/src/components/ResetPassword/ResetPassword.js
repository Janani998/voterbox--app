import React,{Component} from 'react';
import axios from 'axios'
import InitialHeader from '../InitialHeader/InitialHeader';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

class ResetPassword extends Component{
    constructor(){
        super();
        this.state = {
            email : '',
            password : '',
            confirmPassword : '',
            updated : false,
            loading : true,
            error : '',
            messsge : false
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    componentDidMount(){
        let token = this.props.location.search;
        token = token.substring(1,)
        console.log(token)
        axios.get('http://localhost:8080/users/resetPassword',{
            params : {
                resetPasswordToken : token
            }
        })
        .then(response =>{
            console.log(response.data.email);
            if(response.status === 200){
                this.setState({
                    email : response.data.email,
                    updated : false,
                    loading : false,
                    error : ''
                })
            }else{
                this.setState({
                    updated : false,
                    loading : false,
                    error : response.data.msg
                })
            }
        })
        .catch(err =>{
            if(err){
                this.setState({error : err.response.data.msg,
                    loading : false
                })
            }
        })
    }

    handleChange(event){
        this.setState({[event.target.name] : event.target.value,
            error : ''
        });
    }

    updatePassword(event){
        event.preventDefault();
        const {email,password,confirmPassword} = this.state;
        const passwordReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if(!password){
            this.setState({error : "All fields are mandatory"});
            return;
        }
        if(!(passwordReg.test(password))){
            this.setState({error : "Password must contain atleast 1 uppercase letter, 1 digit and 1 special symbol"});
        }
        if(confirmPassword !== password){
            this.setState({error : "Conform Password didn't match with password"});
            return;
        }
        this.setState({messsge  :true})
        axios.patch(`http://localhost:8080/users/updatePassword`,{
            email,
            password
        })
        .then(response =>{
            if(response.status === 200){
                this.setState({
                    updated : true,
                    error : '',
                    message : false
                })
            }else{
                this.setState({
                    updated : false,
                    error : response.data.msg,
                    messsge : false
                })
            }
        })
        .catch(err =>{
            if(err){
                this.setState({error : err.response.data.msg,
                    updated : false,
                    message : false
                })
            }
        })
    }

    handleClose(){
        this.setState({updated : false})
        this.props.history.push("/");
    }
    
    render(){
        const {password,confirmPassword,error,loading,updated,message} = this.state;
        return(
            <>
                <InitialHeader title = "Reset Password - VoterBox" />
                <div className = "container">
                    {loading && <CircularProgress />}
                    <div className = "loginContainer">
                    <Typography variant="h4" component="h1" style = {{marginBottom : "80px"}} >Reset Password</Typography>
                    <TextField label="Enter New Password" name = "password" type = "password" fullWidth variant ="outlined" value ={password} margin = 'normal' onChange ={this.handleChange} />
                    <TextField label="Reenter New Password" name = "confirmPassword" type = "password" fullWidth variant ="outlined" value ={confirmPassword} margin = 'normal' onChange ={this.handleChange} />
                    {error && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {error} <strong>check it out!</strong>
                        </Alert>
                    )}
                    <Button variant="contained" color="primary" onClick ={this.updatePassword} >Update Password</Button>
                    {message && (
                    <Alert>
                        Please wait updating password in your account
                    </Alert>
                )}
                    </div>
                </div>
                <Dialog
                open={updated}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <Typography color = "error" variant="h6" component="h6">
                    Your Password has been sucessfully reset. Try logging in again.
                </Typography>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    LogIn
                </Button>
                </DialogActions>
            </Dialog>
            </>
        );
    }
}

export default ResetPassword;