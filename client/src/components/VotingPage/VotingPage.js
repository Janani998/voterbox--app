import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Radio, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Header from '../Header/Header';
import "./VotingPage.css";
import axios from 'axios'
import { Alert, AlertTitle } from '@material-ui/lab';

class VotingPage extends Component{
    constructor(){
        super();
        this.state = {
            selectedValue : "",
            candidatesList : [],
            open : false,
            errorOpen : false,
            errorMessage : "",
            error : "",
            loading : false,
            registering : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        this.setState({loading : true})
    if (!window.localStorage.getItem('login')) { this.props.history.push('/') }
    const login = JSON.parse(window.localStorage.getItem('login'))
    axios.get('http://localhost:8080/candidates/retriveCandidateList', {
      headers: { 'x-auth-token': login.token }
    })
      .then((response) => {
        this.setState({candidatesList :  response.data,
            loading : false
        })
      })
      .catch((error) => {
        if(error){
            this.setState({
                error : error.response.data.msg,
                errorOpen : true,
                loading : false
            })
        }
      })
    }

    handleChange(event){
        this.setState({selectedValue : event.target.value})
    }

    handleClose(){
        this.props.history.push("/home")
    }


    handleVote(){
        if(!this.state.selectedValue){
            this.setState({errorMessage : "Please select any one before submitting your vote"})
        }
        else{
        this.setState({registering : true,
            errorMessage : ""
            })
        const login = JSON.parse(window.localStorage.getItem('login'))
        const id = login.user.id
        console.log(id);
        axios.patch(`http://localhost:8080/candidates/addVote/${id}`,{
            candidateID : this.state.selectedValue
        })
        .then((response) => {
            if(response.status === 200){
                this.setState({
                 selectedValue : "",
                 open : true,
                 registering : false
                })
            }
            else{ 
                console.log("Can't cast vote");
               
            }
          })
          .catch((error) => {
            if(error){
                this.setState({error : error.response.data.msg,
                    errorOpen : true,
                    registering : false
                })
            }
          });
        }
    }

    render(){
        const {selectedValue,candidatesList,open,errorOpen,error,loading,registering,errorMessage} = this.state;
        return(
            <div>
                <Header title = "Voting Page - VoterBox"/>
                <div className = "votingContainer">
                {loading && <CircularProgress />}
                    {(candidatesList.length !== 0) &&(
                         <div className = "innerContainer">
                             <div className = "voteHeading">
                             <Typography className = "imageContainer" variant="h6" component="h6">Party Logo</Typography>
                             <Typography className = "name" variant="h6" component="h6">Candidate Name</Typography>
                             <Typography className = "partyName" variant="h6" component="h6">Party Name</Typography>
                             </div>
                        {candidatesList.map(candidate => 
                        <Paper key ={candidate._id} style = {{backgroundColor : "#F1E6E6",height : "70px" ,width : "90%", display : "flex",flexDirection: "row",alignItems : "center", margin : "20px"}} variant="outlined" square  elevation={3}>
                            <div className = "imageContainer">
                            <img src = {candidate.partyLogo} alt = "" height = "100%" width = "60%" margin = "50px"/>
                            </div>
                            <Typography className = "name" variant="h6" component="h6">{candidate.candidateName}</Typography>
                            <Typography className = "partyName" variant="h6" component="h6">{candidate.partyName}</Typography>
                            <Radio
                                style = {{height : "100%" ,width : "20%"}}
                                checked={selectedValue === candidate._id}
                                onChange={this.handleChange}
                                value= {candidate._id}
                                size = "medium"
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                        </Paper>
                        )}
                        </div>
                    )}
                    {candidatesList.length !== 0 &&(
                        <div>
                        {errorMessage && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage} <strong>check it out!</strong>
                            </Alert>
                        )}
                        <Button variant="contained" color="primary" margin = 'normal'  onClick ={this.handleVote}>Vote</Button>
                     </div>
                     )}
                     
                     <Dialog
                        open={registering}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Registering your vote..."}</DialogTitle>
                        <DialogContent>
                            <CircularProgress />
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={errorOpen}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title"><Typography color = "error" variant="h6" component="h6">{"Can't vote"}</Typography></DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography color = "error" variant="h6" component="h6">{error}</Typography>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Move to Home
                        </Button>
                        </DialogActions>
                    </Dialog>
                    
                    <Dialog
                        open={open}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <Typography color = "textPrimary" variant="h6" component="h6">
                                {"Sucessfully casted vote"}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <Typography color = "textPrimary" variant="h6" component="h6">
                            Your vote has been registered sucessfully. Now press "Move to Home".
                        </Typography>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Move to Home
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default VotingPage;