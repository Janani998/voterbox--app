import React,{Component} from 'react'
import Header from '../Header/Header';
import "../Signup/Signup.css"
import axios from 'axios';
import { Box, CircularProgress, IconButton, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

class Profile extends Component{
    constructor(){
        super();
        this.state = {
            user : "",
            address1 : "",
            address2 : "",
            address3 : "",
            address4 : "",
            error : "",
            loading : false
        } 
        this.handleEditMove = this.handleEditMove.bind(this);
    }
    componentDidMount () {
        if (!window.localStorage.getItem('login')) { this.props.history.push('/') }
        else{
            this.setState({loading : true})
            const login = JSON.parse(window.localStorage.getItem('login'))
            axios.get('http://localhost:8080/users/',{
                headers: { 'x-auth-token': login.token }
            }).then(response =>{
                const date = response.data.DOB.substring(0,10);
                const splittedDate = date.split("-").map(el => parseInt(el,10));
                [splittedDate[0],splittedDate[2]] = [splittedDate[2],splittedDate[0]];
                response.data.DOB = splittedDate.join('/')
                const u = response.data;
                const line1 = ''.concat(u.doorno,",",u.streetName,",")
                const line2 = ''.concat(u.area,",",u.city,",")
                const line3 = ''.concat(u.state,",",u.country,",")
                const line4 = ''.concat("pincode : ",u.pincode)
                this.setState({
                    user : response.data,
                    address1 : line1,
                    address2 : line2,
                    address3 : line3,
                    address4 : line4,
                    loading : false
                })
            }).catch(error =>{
                if(error){
                    this.setState({error : error.response.data.msg,
                        loading : false
                    })
                }
            })
        }
      }

      handleEditMove(){
        this.props.history.push("/editProfile")
      }

    render(){
        const {user,loading,error} = this.state;
        return(
            <div>
                <Header title = "My Account - VoterBox"/>
                <div className = "mainContainer">
                {error ? <Typography variant="h3" component="h4">My Account</Typography> : (
                    <div className = "signupContainer">
                        {loading && <CircularProgress />}
                        <Box display="flex" flexDirection="row" ml = {1}>
                        <Typography variant="h3" component="h1">My Account</Typography>
                        <IconButton color="secondary" aria-label="edit" onClick ={this.handleEditMove} >
                            <EditIcon fontSize="large"/>
                        </IconButton>
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                            <span style ={{fontStyle : "italic",fontWeight : "bold"}} >User Name :</span>
                            <Box component="span" ml = {6}>
                                {user.userName}
                            </Box> 
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                            <span style ={{fontStyle : "italic",fontWeight : "bold"}} >Email ID :</span>
                            <Box component="span" ml = {9}>
                                {user.email}
                            </Box>
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                        <span style ={{fontStyle : "italic",fontWeight : "bold"}}>Date of Birth :</span>
                            <Box component="span" ml = {5}>
                                {user.DOB}
                            </Box> 
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                        <span style ={{fontStyle : "italic",fontWeight : "bold"}} >Gender : </span>
                            <Box component="span" ml = {10}>
                                {user.gender}
                            </Box>
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                        <span style ={{fontStyle : "italic",fontWeight : "bold"}} >Mobile Number : </span>
                            <Box component="span" ml = {2}>
                                {user.mobileNumber}
                            </Box>
                        </Box>
                        <Box component="span" display="block" p={1} m={1} bgcolor="#FCFAF5">
                        <span style ={{fontStyle : "italic",fontWeight : "bold"}} >Aadhaar Number :</span>
                            <Box component="span" ml = {1}>
                            {user.aadhaarNumber}
                            </Box>
                        </Box>
                        <Box component="div" display="block" p={1} m={1} bgcolor="#FCFAF5">
                        <span style ={{fontStyle : "italic",fontWeight : "bold"}} >Address : </span>
                            <Box component="span" ml = {9}>
                                {this.state.address1}
                            </Box>
                            <Box component="span" display="block" ml = {18}>
                                {this.state.address2}
                            </Box>
                            <Box component="span" display="block" ml = {18}>
                                {this.state.address3}
                            </Box>
                            <Box component="span" display="block" ml = {18}>
                                {this.state.address4}
                            </Box>
                        </Box>
                    </div>
                     )}
                </div>
            </div>
        );
    }
}

export default Profile;