const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    role : {
        type : String
    },
    isVoted : {
        type :Boolean
    },
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    mobileNumber : {
        type : Number,
        required : true
    },
    aadhaarNumber : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    resetPasswordToken :{
        type : String
    },
    resetPasswordExpires: {
        type : Number
    },
    DOB : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    doorno : {
        type : String,
        required : true
    },
    streetName : {
        type : String,
        required : true
    },
    area : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    },
    imageURL:{
        type: String,
        required : true
    },
    createdAt : {
        type: Number
    },
    updatedAt : {
        type: Number
    }
})

module.exports = User = mongoose.model('users',userSchema);