const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    candidateName : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    partyName : {
        type : String,
        required : true
    },
    partyLogo : {
        type : String,
        required : true
    },
    place : {
        type : String,
        required : true
    },
    electionDate : {
        type : Date,
        required : true
    },
    formattedElectionDate : {
        type : Number
    },
    voteCount : {
        type :Number,
    },
    createdAt : {
        type: Number
    },
    updatedAt : {
        type: Number
    }
})

module.exports = Candidate = mongoose.model('candidates',candidateSchema);