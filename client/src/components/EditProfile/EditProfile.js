import React, { Component } from 'react';
import "../Signup/Signup.css";
import "../Login/Login.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';
import axios from 'axios'
import { Alert, AlertTitle } from '@material-ui/lab';
import Header from '../Header/Header';
const stateList = ["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman & DiuGoa","Gujarat","Haryana","Himachal Pradesh","Ladakh","Lakshadweep","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","The Government of NCT of Delhi","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"]

class EditProfile extends Component{
    constructor(){
        super();
        this.state = {
            user : "",
            firstName : "",
            lastName : "",
            email : "",
            mobileNumber: "",
            DOB : "",
            aadhaarNumber : "",
            gender : "female",
            doorno : "",
            streetName : "",
            area : "",
            city : "",
            state : "",
            country: "India",
            pincode : "",
            error : "",
            sucessMessage :"",
            open : false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.capitalize = this.capitalize.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

    }
    componentDidMount(){
        if (!window.localStorage.getItem('login')) { this.props.history.push('/') }
        else{
            const login = JSON.parse(window.localStorage.getItem('login'))
            axios.get('http://localhost:8080/users/',{
                headers: { 'x-auth-token': login.token }
            }).then(response =>{
                const date = response.data.DOB.substring(0,10);
                const splittedDate = date.split("-").map(el => parseInt(el,10));
                response.data.DOB = splittedDate.join("-")
                this.setState({user : response.data},()=>{
                    const user = this.state.user
                    const name = user.userName.split(" ");
                    const first = name[0];
                    const last = name[1];
                    this.setState({
                        firstName : first,
                        lastName : last,
                        email : user.email,
                        mobileNumber: user.mobileNumber,
                        DOB : user.DOB,
                        aadhaarNumber :user.aadhaarNumber,
                        gender : user.gender,
                        doorno : user.doorno,
                        streetName : user.streetName,
                        area : user.area,
                        city : user.city,
                        state : user.state,
                        country: user.country,
                        pincode : user.pincode,
                    })
                })
            }).catch(error =>{
                if(error){
                        this.setState({error : error.response.data.msg})
                }
            })
        }
    }

    capitalize(s){
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      }

    isEligibleAge(date){
        const splittedDate = date.split("-").map(el => parseInt(el,10));
        return new Date(splittedDate[0]+18, splittedDate[1]-1, splittedDate[2]) <= new Date();
    }

    validate(){
        const {firstName,lastName,email,mobileNumber,DOB,aadhaarNumber,doorno,streetName,area,city,state,country,pincode} = this.state;
        const nameReg =  /^[A-Za-z]+$/;
        const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; 
        const phoneReg = /^\d{10}$/;
        const aadhaarReg = /^\d{12}$/;
        const pinReg = /^\d{6}$/;
        if(!firstName || !lastName || !email || !mobileNumber|| !aadhaarNumber || !doorno || !streetName || !area || !city || !state || !country || !pincode){
            this.setState({error : "All fields are mandatory"});
            return;
        }
        if(!firstName.match(nameReg)){
            this.setState({error : "First Name should contain only alphabets"});
            return;
        }
        if(!lastName.match(nameReg)){
            this.setState({error : "Last Name should contain only alphabets"});
            return;
        }
        if(!email.match(emailReg)){
            this.setState({error : "Enter valid EmailID"});
            return;
        }
        if(!mobileNumber.match(phoneReg)){
            this.setState({error : "Enter valid mobile number with only 10 digits"});
            return;
        }
        if(!aadhaarNumber.match(aadhaarReg)){
            this.setState({error : "Enter valid aadhaar number"});
            return;
        }
        if(!this.isEligibleAge(DOB)){
            this.setState({error : "Age is not eligible to vote"});
            return;
        }
        console.log(typeof pincode)
        if(!pincode.toString().match(pinReg)){
            this.setState({error : "Enter valid pincode"});
            return;
        }
        return true;
    }

    handleUpdate(){
        const {firstName,lastName,email,mobileNumber,DOB,aadhaarNumber,gender,doorno,streetName,area,city,state,country,pincode} = this.state;
        const name = this.capitalize(firstName)+ " " + this.capitalize(lastName);
        const id = this.state.user._id;
        if(this.validate()){
            axios.patch(`http://localhost:8080/users/edit/${id}`, {
                userName : name,
                email,
                mobileNumber,
                DOB,
                aadhaarNumber,
                gender,
                doorno,
                streetName,
                area : this.capitalize(area),
                city : this.capitalize(city),
                state : this.capitalize(state),
                country : this.capitalize(country),
                pincode,
            })
              .then((response) => {
                if(response.status === 200){
                    this.setState({
                        sucessMessage : "Account updated sucessfully",
                        open : true
                    })
                }
                else{ 
                    console.log("User Account Already present");
                   
                }
              })
              .catch((error) => {
                if(error){
                    this.setState({error : error.response.data.msg})
                }
              });
        }
    }

    handleClose(){
        this.setState({open : false})
    }


    handleChange(e){
        this.setState({[e.target.name] : e.target.value});
        this.setState({error : ""});
    }

    render(){
        const {firstName,lastName,email,mobileNumber,aadhaarNumber,DOB,gender,doorno,streetName,area,city,state,country,pincode,error,sucessMessage,open} = this.state;
        return(
            <>
             <Header title = "Edit Profile - VoterBox"/>
            <div className ="mainContainer">
                <div className = "signupContainer">
                    <Typography variant="h3" component="h1">Update Profile</Typography>
                    <Grid container direction={"row"} spacing={10}>
                        <Grid item>
                            <TextField label="First Name" fullWidth required name = "firstName" margin = 'normal'  value = {firstName} onChange = {this.handleChange} />
                        </Grid>
                        <Grid item>
                            <TextField label="Last Name" fullWidth required name = "lastName" margin = 'normal'  value = {lastName} onChange = {this.handleChange} /> 
                        </Grid>
                    </Grid>
                        <TextField label="Email Id" name = "email" fullWidth required margin = 'normal' value = {email} onChange = {this.handleChange} />
                        <TextField label="Mobile Number" fullWidth required name = "mobileNumber" margin = 'normal' value = {mobileNumber} onChange = {this.handleChange} />
                        <TextField label="Aadhaar Number" fullWidth required name = "aadhaarNumber" margin = 'normal' value = {aadhaarNumber} onChange = {this.handleChange} />
                        <FormControl component="fieldset" margin = 'normal'>
                            <FormLabel component="legend">Gender *</FormLabel>
                                <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={this.handleChange}>
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
                        </FormControl>
                        <TextField
                            id="date"
                            label="Date of Birth"
                            type="date"
                            name = "DOB"
                            value = {DOB}
                            defaultValue= {DOB}
                            onChange={ this.handleChange }
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                        <div className="border" />
                        <div className = "heading">Address (As per in voter's ID)</div>
                        <Grid container direction={"row"} spacing={10}>
                            <Grid item>
                                <TextField label="Door No" required name = "doorno" fullWidth margin = 'normal' value = {doorno} onChange = {this.handleChange} />
                            </Grid>
                            <Grid item>
                                <TextField label="Street Name" required name = "streetName" fullWidth margin = 'normal' value = {streetName} onChange = {this.handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} spacing={10}>
                            <Grid item>
                                <TextField label="Area" required name = "area" fullWidth margin = 'normal' value = {area} onChange = {this.handleChange} />
                            </Grid>
                            <Grid item>
                                <TextField label="City" required name = "city" fullWidth margin = 'normal' value = {city} onChange = {this.handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} spacing={10}>
                            <Grid item>
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">Select State...</InputLabel>
                                <Select
                                style={{width: "200px"}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name = "state"
                                defaultValue = "Select State..."
                                value={state}
                                onChange={this.handleChange}
                                >
                                {stateList.map(state => (
                                    <MenuItem key ={state} value={state}>{state}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            </Grid>
                            <Grid item>
                                <TextField label="Country" required name = "country" fullWidth margin = 'normal' value = {country} onChange = {this.handleChange} />
                            </Grid>
                            <Grid item>
                                <TextField label="Pincode" required name = "pincode" fullWidth margin = 'normal' value = {pincode} onChange = {this.handleChange} />   
                            </Grid>
                        </Grid>
                        <div className="border" />
                        {error && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {error} <strong>check it out!</strong>
                          </Alert>
                        )}
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{sucessMessage}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Your account has been updated sucessfully. Press OK.
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                OK
                            </Button>
                            </DialogActions>
                        </Dialog>
                        <Button variant="contained" color="primary" margin = 'normal' onClick ={this.handleUpdate}>Update</Button>
                    </div>
                </div>
            </>
        );
    }
}
export default EditProfile;