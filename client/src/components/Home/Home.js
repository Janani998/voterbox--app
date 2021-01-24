import { Button } from '@material-ui/core';
import React, { Component } from 'react'
import Header from '../Header/Header'
import "./Home.css"

class Home extends Component{
    constructor(){
        super();
        this.state = {
            role : ""
        }
        this.handleVoteMove = this.handleVoteMove.bind(this);
        this.handleAddMove = this.handleAddMove.bind(this);
        this.handleResultsMove = this.handleResultsMove.bind(this);
    }

    componentDidMount () {
        if (!window.localStorage.getItem('login')) { 
            this.props.history.push('/') 
        }else{
            const login = JSON.parse(window.localStorage.getItem('login'))
            this.setState({role : login.user.role})
        }
      }
    handleVoteMove(){
        this.props.history.push("/votingpage");
    }
    handleAddMove(){
        this.props.history.push("/uploadCandidateData");
    }
    handleResultsMove(){
        this.props.history.push("/viewResults");
    }
    render(){
        return(
            <>
            <Header title = "Home - VoterBox"/>
            <div className = "homeContainer">
                <div className = "buttonContainer">
                    <Button variant="contained" color="secondary" margin = 'normal' onClick ={this.handleVoteMove}>Vote</Button>
                    {this.state.role === "admin" && (
                        <Button variant="contained" color="secondary" margin = 'normal' onClick ={this.handleAddMove}>Add Candidate</Button>
                    )}
                    {this.state.role === "admin" && (
                        <Button variant="contained" color="secondary" margin = 'normal' onClick ={this.handleResultsMove}>View Results</Button>
                    )}
                </div>
            </div>
            </>
        );
    }
}

export default Home