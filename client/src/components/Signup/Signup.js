import React, { Component } from 'react';
import "./Signup.css";
import "../Login/Login.css";
import { Link } from 'react-router-dom';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@material-ui/core';
import axios from 'axios'
import { Alert, AlertTitle } from '@material-ui/lab';
import InitialHeader from '../InitialHeader/InitialHeader';
const stateList = ["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman & DiuGoa","Gujarat","Haryana","Himachal Pradesh","Ladakh","Lakshadweep","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","The Government of NCT of Delhi","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"]

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName : "",
            lastName : "",
            email : "",
            mobileNumber: "",
            password : "",
            conformPassword :"",
            DOB : null,
            aadhaarNumber : "",
            gender : "female",
            doorno : "",
            streetName : "",
            area : "",
            city : "",
            state : "",
            country: "India",
            pincode : "",
            selectedImage : null,
            imageURL : "",
            error : "",
            sucessMessage :"",
            open : false,
            loading : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.validate = this.validate.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.capitalize = this.capitalize.bind(this);
        this.handleClose = this.handleClose.bind(this);
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
        const {firstName,lastName,email,password,conformPassword,mobileNumber,DOB,aadhaarNumber,doorno,streetName,area,city,state,country,pincode,selectedImage} = this.state;
        const nameReg =  /^[A-Za-z]+$/;
        const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; 
        const passwordReg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        const phoneReg = /^\d{10}$/;
        const aadhaarReg = /^\d{12}$/;
        const pinReg = /^\d{6}$/;
        if(!firstName || !lastName || !email || !mobileNumber|| !password || !conformPassword || !aadhaarNumber || !doorno || !streetName || !area || !city || !state || !country || !pincode){
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
        if(!password.match(passwordReg)){
            this.setState({error : "Enter valid password"});
            return;
        }
        if(conformPassword !== password){
            this.setState({error : "Conform Password didn't match with password"});
            return;
        }
        if(!mobileNumber.match(phoneReg)){
            this.setState({error : "Enter valid mobile number with 10 digits"});
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
        if(!pincode.match(pinReg)){
            this.setState({error : "Enter valid pincode"});
            return;
        }
        if(!selectedImage){
            this.setState({error : "Select a image file to upload"})
            return;
        }
        const type = selectedImage.type;
        const size = selectedImage.size;
        if(type !== "image/png" && type !== "image/jpg" && type !== "image/jpeg"){
            this.setState({error : "Only .jpeg, .jpg, .png file extentions are allowed"})
            return
        }
        if(size > 60000){
            this.setState({error : "Image size is larger that 60KB"})
            return
        }
        return true;
    }

    handleSignup(){
        this.setState({loading : true})
        const {firstName,lastName,email,password,mobileNumber,DOB,aadhaarNumber,gender,doorno,streetName,area,city,state,country,pincode,imageURL} = this.state;
        const name = this.capitalize(firstName)+ " " + this.capitalize(lastName);
        if(this.validate()){
            axios.post('http://localhost:8080/users/register', {
                userName : name,
                email,
                password,
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
                imageURL
            })
              .then((response) => {
                console.log(response);
                if(response.status === 200){
                    this.setState({
                        sucessMessage : "Account registered sucessfully",
                        firstName : "",
                        lastName : "",
                        email : "",
                        mobileNumber: "",
                        password : "",
                        conformPassword :"",
                        DOB : "",
                        aadhaarNumber : "",
                        gender : "female",
                        doorno : "",
                        streetName : "",
                        area : "",
                        city : "",
                        state : "",
                        country: "",
                        pincode : "",
                        selectedImage : null,
                        imageURL : "",
                        open : true,
                        loading : false
                    })
                }
                else{ 
                    console.log("User Account Already present");
                   
                }
              })
              .catch((error) => {
                if(error){
                    this.setState({error : error.response.data.msg,
                        loading : false
                    })
                }
              });
        }
    }

    handleClose(){
        this.setState({loading : false})
        this.props.history.push("/")
    }

    handleImageChange(event){
        this.setState({error : ""});
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                selectedImage : file,
                imageURL : reader.result
            })
          }
        reader.readAsDataURL(file)
    }


    handleChange(e){
        this.setState({[e.target.name] : e.target.value});
        this.setState({error : ""});
    }

    render(){
        const {firstName,lastName,email,password,conformPassword,mobileNumber,aadhaarNumber,gender,doorno,streetName,area,city,state,country,pincode,error,sucessMessage,open,loading} = this.state;
        return(
            <>
            <InitialHeader title ="Signup - VoterBox" />
            <div className ="mainContainer">
                
                <div className = "signupContainer">
                    <Typography variant="h3" component="h1">Register</Typography>
                    <Grid container direction={"row"} spacing={10}>
                        <Grid item>
                            <TextField label="First Name" fullWidth required name = "firstName" margin = 'normal'  value = {firstName} onChange = {this.handleChange} />
                        </Grid>
                        <Grid item>
                            <TextField label="Last Name" fullWidth required name = "lastName" margin = 'normal'  value = {lastName} onChange = {this.handleChange} /> 
                        </Grid>
                    </Grid>
                        <TextField label="Email Id" name = "email" fullWidth required margin = 'normal' value = {email} onChange = {this.handleChange} />
                        <Typography variant="subtitle2" component="h6">Password Guidelines</Typography>
                        <Typography variant="caption" component="h6">1. Password length should be greaterthan or equalto 8</Typography>
                        <Typography variant="caption" component="h6">2. Password should contain atleast 1 uppercase character</Typography>
                        <Typography variant="caption" component="h6">3. Password should contain atleast 1 digit</Typography>
                        <Typography variant="caption" component="h6">4. Password should contain atleast 1 of !@#$%^&*</Typography>
                        <TextField type = "password" fullWidth required label="Password" name = "password" margin = 'normal' value = {password} onChange = {this.handleChange} />
                        <TextField type = "password" fullWidth required label="Conform Password" name = "conformPassword" margin = 'normal' value = {conformPassword} onChange = {this.handleChange} />
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
                        <div className = "fileContainer">
                            <label className = "heading">Upload Voter ID : </label>
                            <input type = "file" onChange = {this.handleImageChange}/>
                        </div>
                        {error && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {error} <strong>check it out!</strong>
                          </Alert>
                        )}
                        <Dialog
                            open={loading}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Registering..."}</DialogTitle>
                            <DialogContent>
                                <CircularProgress />
                            </DialogContent>
                        </Dialog>
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{sucessMessage}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Your account has been registered sucessfully. Now press "Login".
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Login
                            </Button>
                            </DialogActions>
                        </Dialog>
                        <Button variant="contained" color="primary" margin = 'normal' onClick ={this.handleSignup}>Sign Up</Button>
                        <div className = "lastSection">Already have a account<Link to= "/">Login</Link></div>
                    </div>
                </div>
            </>
        );
    }
}

export default Signup;