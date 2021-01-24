import React,{Component} from 'react'
import "../Login/Login.css";
import "./CandidateUpload.css"
import axios from 'axios'
import Header from '../Header/Header';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, InputLabel, MenuItem, Select, TextField, Typography,Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
const stateList = ["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman & DiuGoa","Gujarat","Haryana","Himachal Pradesh","Ladakh","Lakshadweep","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","The Government of NCT of Delhi","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"]
const partyList = ["Aam Aadmi Party","All India Anna Dravida Munnetra Kazhagam","All India Forward Bloc","All India Majlis-e-Ittehadul Muslimeen","All India N.R. Congress","All India Trinamool Congress","All India United Democratic Front","All Jharkhand Students Union","Asom Gana Parishad","Bahujan Samaj Party","Bharatiya Janata Party","Biju Janata Dal","Bodoland People's Front","Communist Party of India","Communist Party of India (Marxist)","Communist Party of India (Marxist–Leninist) Liberation","Desiya Murpokku Dravida Kazhagam","Dravida Munnetra Kazhagam","Goa Forward Party","Hill State People's Democratic Party","Indian National Congress","Indian National Lok Dal","Indian Union Muslim League","Indigenous People's Front of Tripura","Jammu & Kashmir National Conference","Jammu and Kashmir National Panther's Party","Jammu and Kashmir People's Democratic Party","Janta Congress Chhattisgarh","Janata Dal (Secular)","Janata Dal (United)","Jannayak Janta Party","Jharkhand Mukti Morcha","Kerala Congress (M)","Lok Janshakti Party","Maharashtra Navnirman Sena","Maharashtrawadi Gomantak Party","Mizo National Front","Mizoram Peoples Conference","Naga Peoples Front","National People's Party","Nationalist Congress Party","Nationalist Democratic Progressive Party","Pattali Makkal Katchi","People's Democratic Alliance","People's Democratic Front","People's Party of Arunachal","Rashtriya Janata Dal","Rashtriya Lok Dal","Rashtriya Lok Samta Party","Rashtriya Loktantrik Party","Revolutionary Socialist Party","Samajwadi Party","Shiromani Akali Dal","Shiv Sena","Sikkim Democratic Front","Sikkim Krantikari Morcha","Telangana Rashtra Samithi","Telugu Desam Party","United Democratic Party","Yuvajana Sramika Rythu Congress Party","Zoram Nationalist Party"]
class CandidateUpload extends Component{
    constructor(){
        super();
        this.state = {
            candidateName : "",
            gender : "female",
            partyName : "",
            selectedImage : null,
            partyLogo : "",
            place : "",
            electionDate : "",
            errorMessage : "",
            open : false,  
            loading : false  
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleNext  = this.handleNext.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.validate = this.validate.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount () {
        if (!window.localStorage.getItem('login')) { this.props.history.push('/') }
    }

    validate(){
        const {candidateName,gender,partyName,selectedImage,place,electionDate} = this.state;
        if(!candidateName || !partyName || !selectedImage || !place ||!electionDate ||!gender){
            this.setState({errorMessage : "All fields are mandatory"})
            return
        } 
        if(!/^[a-z][a-z\s]*$/i.test(candidateName)){
            this.setState({errorMessage : "Candidate Name should contain only alphabets"});
            return;
        }
        if(!selectedImage){
            this.setState({errorMessage : "Select a image file to upload"})
            return
        }
        const type = selectedImage.type;
        const size = selectedImage.size;
        if(type !== "image/png" && type !== "image/jpg" && type !== "image/jpeg"){
            this.setState({errorMessage : "Only .jpeg, .jpg, .png file extentions are allowed"})
            return
        }
        if(size > 60000){
            this.setState({errorMessage : "Image size is larger that 60KB"})
            return
        }
        return true
    }
    
    handleAdd(){
        const {candidateName,gender,partyName,partyLogo,place,electionDate} = this.state;
        if(this.validate()){
            this.setState({loading : true})
            axios.post('http://localhost:8080/candidates/addCandidate', {
                candidateName,
                gender,
                partyName,
                place,
                electionDate,
                partyLogo,
            })
              .then((response) => {
                if(response.status === 200){
                    this.setState({
                        open : true,
                        loading : false
                    })
                }
              })
              .catch((error) => {
                if(error){
                    this.setState({errorMessage : error.response.data.msg,
                        open : false,
                        loading : false})
                }
              });
        }else{
            this.setState({loading : false})
        }
    }

    handleClose(){
        this.setState({
            loading : false,
            open : false
        })
        this.props.history.push("/home")
    }

    handleNext(){
        this.setState({successMessage : "",
                        open : false,
                        candidateName : "",
                        gender : "female",
                        partyName : "",
                        partyLogo : "",
                        place : "",
                        selectedImage : null,
                        electionDate : "",
                        errorMessage : "",
                        loading : false,
        })
    }

    handleImageChange(event){
        this.setState({errorMessage : ""})
        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(file)
        reader.onloadend = () => {
            this.setState({
                image : file.name,
                selectedImage : file,
                partyLogo : reader.result
            })
          }
        reader.readAsDataURL(file)
    }

    handleChange(event){
        this.setState({
            [event.target.name] :  event.target.value,
            errorMessage : ""
        });
    }

    render(){
        const {candidateName,gender,partyName,place,electionDate,errorMessage,open,loading} = this.state
        return(
            <>
            <Header title = "Candidate Details Upload - VoterBox"/>
            <div className = "boxContainer">
            <div className = "displayContainer">
                <Typography variant="h3" component="h1">Add Candidate</Typography>
                <TextField label="Candidate Name" name = "candidateName" fullWidth required margin = 'normal' value = {candidateName} onChange = {this.handleChange} />
                <FormControl component="fieldset" fullWidth margin = 'normal'>
                    <FormLabel component="legend">Gender *</FormLabel>
                        <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={this.handleChange}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Select Party Name...</InputLabel>
                    <Select
                    style={{width: "530px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name = "partyName"
                    value={partyName}
                    onChange={this.handleChange}
                    >
                    {partyList.map(party => (
                        <MenuItem key ={party} value={party}>{party}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Select State...</InputLabel>
                    <Select
                    style={{width: "530px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name = "place"
                    defaultValue = "Select State..."
                    value={place}
                    onChange={this.handleChange}
                    >
                    {stateList.map(state => (
                        <MenuItem key ={state} value={state}>{state}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                    id="date"
                    label="Election Date"
                    type="date"
                    name = "electionDate"
                    fullWidth 
                    required 
                    value = {electionDate}
                    margin = 'normal'
                    onChange={ this.handleChange }
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <div className = "fileContainer">
                    <label className = "heading">Upload Party Logo : </label>
                    <input type = "file" name = "partyLogo" onChange = {this.handleImageChange}/>
                </div>
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
                    <DialogTitle id="alert-dialog-title">
                        <Typography color = "textPrimary" variant="h6" component="h6">
                            {"Sucessfully added"}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    <Typography color = "textPrimary" variant="h6" component="h6">
                        Candidate details has been added sucessfully. Press Add Next to add next candidate or press back to move home.
                    </Typography>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Back
                    </Button>
                    <Button color="primary" onClick = {this.handleNext}>
                        Add Next
                    </Button>
                    </DialogActions>
                </Dialog>
                    {errorMessage && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage} <strong>check it out!</strong>
                          </Alert>
                        )}
                <Button variant="contained" color="primary" margin = 'normal' onClick ={this.handleAdd}>Add</Button>
            </div>
            </div>
        </>
        );
    }
}

export default CandidateUpload;