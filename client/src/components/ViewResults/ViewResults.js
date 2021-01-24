import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import React,{Component} from "react";
import Header from "../Header/Header";
import axios from 'axios';
import "./ViewResults.css"
import { Alert, AlertTitle } from "@material-ui/lab";

const stateList = ["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman & DiuGoa","Gujarat","Haryana","Himachal Pradesh","Ladakh","Lakshadweep","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","The Government of NCT of Delhi","Tripura","Uttarakhand","Uttar Pradesh","West Bengal"]
class ViewResults extends Component{
    constructor(){
        super();
        this.state = {
            selectedState : "",
            results : [],
            loading : false,
            electionDate : "",
            error : "",
            errorMessage : "",
            open : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleRetriveResults = this.handleRetriveResults.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount () {
        if (!window.localStorage.getItem('login')) { this.props.history.push('/') }
      }

    handleChange(e){
        console.log(e.target.value)
        this.setState({[e.target.name] : e.target.value,
          errorMessage : ""
        })
    }

    handleClose(){
      this.props.history.push("/home")
    }

    handleNext(){
        this.setState({open : false,
          selectedState : "",
          electionDate : ""
        })
    }

    handleRetriveResults(){
        if(!this.state.electionDate || !this.state.selectedState){
          this.setState({errorMessage : "Please enter both state and election date to retrive results"})
          return
        }
        this.setState({loading : true}) 
        axios.get("http://localhost:8080/candidates/retriveResults",{
            params : {
                selectedState : this.state.selectedState,
                electionDate : this.state.electionDate
            }
            
        }).then((response) => {
            console.log(response);
            if(response.status === 200){
                this.setState({
                 results : response.data,
                 loading : false,
                 open : false
                })
                console.log(this.state.results)
            }
            else{ 
                console.log("Can't get Results");
               
            }
          })
          .catch((error) => {
            if(error){
              this.setState({error : error.response.data.msg,
                loading : false,
                open : true
              })
          }
          });
    }

    render(){
        const {selectedState,results,loading,electionDate,error,errorMessage,open} = this.state;
        return(
            <>
                 <Header title = "View Results - VoterBox"/>
                <div className = "resultsContainer">
                <FormControl margin = 'normal'>
                    <InputLabel id="demo-simple-select-label">Select State...</InputLabel>
                    <Select
                    style={{width: "530px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name = "selectedState"
                    defaultValue = "Select State..."
                    value={selectedState}
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
                    style={{width: "530px"}}
                    required 
                    value = {electionDate}
                    margin = 'normal'
                    onChange={ this.handleChange }
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                {errorMessage && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage} <strong>check it out!</strong>
                    </Alert>
                )}
                <Button variant="contained" color="primary" margin = 'normal' onClick ={this.handleRetriveResults}>Get Results</Button>
                {(results.length!== 0) && (
                    <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Party Logo</TableCell>
                          <TableCell align="right">Party Name</TableCell>
                          <TableCell align="right">Candidate Name</TableCell>
                          <TableCell align="right">Vote Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.map((result) => (
                          <TableRow key={result._id}>
                            <TableCell  scope="row">
                            <img src = {result.partyLogo} alt = "" height = "100px" width = "100px" margin = "50px"/>
                            </TableCell>
                            <TableCell align="right">{result.partyName}</TableCell>
                            <TableCell align="right">{result.candidateName}</TableCell>
                            <TableCell align="right">{result.voteCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                </div>
                <Dialog
                      open={loading}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                  >
                      <DialogTitle id="alert-dialog-title">{"Retriving results..."}</DialogTitle>
                      <DialogContent>
                          <CircularProgress />
                      </DialogContent>
                  </Dialog>
                  <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    <Typography color = "error" variant="h6" component="h6">
                        {error}
                    </Typography>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Back
                    </Button>
                    <Button color="primary" onClick = {this.handleNext}>
                          Get Next Result
                    </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default ViewResults;