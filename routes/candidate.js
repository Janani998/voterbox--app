const router = require('express').Router()

const Joi = require('joi')

const Candidate = require('../models/candidateModel')

const User = require('../models/userModel')

const auth = require('../middleware/auth')

const schema = Joi.object({
    candidateName : Joi.string().min(3).max(30).allow(' ').required(),
    gender : Joi.string().required(),
    partyName : Joi.string().allow(' ').required(),
    place :  Joi.string().allow(' ').required(),
    electionDate : Joi.date().required(),
    partyLogo : Joi.string().required()
})

function getCurrentDate(){
    const date = new Date().getDate()
    const month = new Date().getMonth()+1
    const year = new Date().getFullYear()
    const currentDate = ""+year+"-"+"0"+month+"-"+date
    return Date.parse(currentDate)
}

function isValidTime(){
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if((hours >= 7 && hours <= 18) && (minutes >= 0 && minutes <= 59) && (seconds >= 0 && seconds <= 59)){
        return true
    }
    return false
}

router.post('/addCandidate',async(req,res,next)=>{
    try{
        const {candidateName,gender,partyName,place,electionDate,partyLogo} = req.body;
        const validate = schema.validate(req.body);
        if(validate.error){
            return res.status(400).send(validate.error);
        }
        const existingCandidate = await Candidate.findOne({candidateName : candidateName,gender : gender,partyName : partyName, place : place, electionDate : electionDate})
        const alreadyHaveCandidate = await Candidate.findOne({partyName : partyName,place : place,electionDate : electionDate})
        if(existingCandidate){
            return res.status(409).send({msg : "Already entered this candidate"})
        }
        if(alreadyHaveCandidate){
            return res.status(409).send({msg : "Already have candidate in this place"})
        }
        const candidate = new Candidate({
            candidateName,
            gender,
            partyName,
            place,
            electionDate,
            formattedElectionDate:Date.parse(electionDate),
            partyLogo,
            voteCount : 0,
            createdAt : new Date().getTime(),
            updatedAt : new Date().getTime()
        }) 
        const savedCandidate = await candidate.save()
        res.json(savedCandidate)  
    }catch(err){
        res.status(500).json({msg : "Something went wrong"})
    }
})

router.get("/retriveCandidateList" ,auth, async(req,res,next) =>{
    try{
        const value = await User.findById(req.user)
        if(value.isVoted === true){
            return res.status(400).send({msg : "Aldready casted the vote"})
        }
        const currentDate = getCurrentDate();
        const candidateList = await Candidate.find({place : value.state,formattedElectionDate : currentDate})
        if(candidateList.length === 0 || !isValidTime()){
            return res.status(404).send({msg : "There is no election right now"})
        }
        const NOTA = await Candidate.find({partyName : "NOTA"})
        if(NOTA.length !== 0){
            NOTA[0].candidateName = ""
            candidateList.push(NOTA[0])
        }
        res.status(200).send(candidateList)
    }catch(err){
        res.status(500).json({msg  : "Something went wrong"})
    }
})

router.patch("/addVote/:id", async(req,res,next)=>{
    try{
        const id = req.params.id;
        const {candidateID} = req.body;
        const selectedCandidate = await Candidate.findById(candidateID)
        const voteValue = selectedCandidate.voteCount + 1;
        const updatedCandidate = await Candidate.updateOne({_id : candidateID},{voteCount : voteValue,updatedAt : new Date().getTime() })
        const updatedUser = await User.updateOne({_id : id},{isVoted : true,updatedAt : new Date().getTime()})
        res.status(200).json(updatedCandidate)
    }catch(err){
        res.status(500).json({msg  : "Something went wrong"})
    }
    
})

router.get("/retriveResults",async(req,res,next)=>{
    try{
        const {selectedState,electionDate} = req.query;
        const results = await Candidate.find({place : selectedState, electionDate : Date.parse(electionDate)})
        const NOTA = await Candidate.find({partyName : "NOTA"})
        if(results.length === 0){
            return res.status(404).send({msg : "No results found"})
        }
        if(NOTA.length !== 0){
            NOTA[0].candidateName = ""
            results.push(NOTA[0])
        }
        res.status(200).send(results)

    }catch(err){
        res.status(500).json({msg  : "Something went wrong"})
    }
})

module.exports = router