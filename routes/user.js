const router = require('express').Router()

const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

const Joi = require('joi')

const User = require('../models/userModel')

const auth = require('../middleware/auth')

const crypto = require('crypto')

const nodemailer = require('nodemailer')

const schema = Joi.object({
    userName : Joi.string().min(3).max(30).allow(' ').required(),
    email : Joi.string().email().required(),
    password : Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')),
    mobileNumber : Joi.number().integer().allow('+').min(1000000000).max(99999999999).positive().required(),
    DOB : Joi.date().less('now').required(),
    aadhaarNumber : Joi.number().integer().min(100000000000).max(999999999999).positive().required(),
    gender : Joi.string().required(),
    doorno : Joi.string().allow(' ').allow('/').allow('-').required(),
    streetName : Joi.string().allow(' ').allow(',').required(),
    area : Joi.string().allow(' ').required(),
    city : Joi.string().allow(' ').required(),
    state : Joi.string().allow(' ').required(),
    country : Joi.string().allow(' ').required(),
    pincode : Joi.number().min(600000).max(700000).positive().required(),
    imageURL : Joi.string().required()
})

function isEligibleAge(day, month, year){
    return new Date(year+18, month-1, day) <= new Date();
}

router.post('/register',async(req,res)=>{
    try{
        const {userName,email,password,mobileNumber,DOB,aadhaarNumber,gender,doorno,streetName,area,city,state,country,pincode,imageURL} = req.body;
        const validate = schema.validate(req.body);
        if(validate.error){
            return res.status(400).send({msg : validate.error.details[0].message});
        }
        const splittedDate = DOB.split("-").map(el => parseInt(el,10));
        if(!isEligibleAge(splittedDate[0],splittedDate[1],splittedDate[2])){
            return res.status(400).send("Not given a valid Date of birth");
        }
        const existingUser = await User.findOne({email : email})
        if(existingUser){
            return res.status(409).send({msg : "User account already exists. Login"})
        }
        const existingAadhaar = await User.findOne({aadhaarNumber : aadhaarNumber})
        if(existingAadhaar){
            return res.status(409).send({msg : "Already have an account using this aadhaar number"})
        }
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,salt)
        const user = new User({
            role : "user",
            isVoted : false,
            userName,
            email,
            password : passwordHash,
            resetPasswordToken : "",
            resetPasswordExpires : Date.now(),
            mobileNumber,
            DOB,
            aadhaarNumber,
            gender,
            doorno,
            streetName,
            area,
            city,
            state,
            country,
            pincode,
            imageURL,
            createdAt : Date.now(),
            updatedAt : Date.now()
        }) 
        const savedUser = await user.save()
        res.json(savedUser)  
    }catch(err){
        res.status(500).json({error  :"Something went wrong"})
    }
})

router.post('/login', async (req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(403).send({msg : "User account does not exists"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).send({msg : "Invalid email id or password"})
        }
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET)
        res.json({
            token,
            user : {
                id : user._id,
                role : user.role
            }
        })
    }catch(err){
        res.status(500).json({msg  : "Something went wrong"})
    }
    
})

router.get('/', auth, async (req, res,next) => {
    try {
      const user = await User.findById(req.user)
      if(!user){
          res.status(404).send({msg : "Account not present"})
      }
      res.status(200).send(user);
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong" })
    }
})

router.patch('/edit/:id', async (req,res,next)=>{
    try { 
        const {userName,email,mobileNumber,DOB,aadhaarNumber,gender,doorno,streetName,area,city,state,country,pincode} = req.body;
        const id = req.params.id
        const updatedUser = await User.updateOne({_id : id},{userName : userName,email : email,mobileNumber : mobileNumber,DOB : DOB,aadhaarNumber : aadhaarNumber,gender : gender,doorno :doorno,streetName : streetName,area : area,city : city,state : state,country : country,pincode : pincode})
        res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong" })
    }
})


router.post('/forgotPassword' , async (req,res,next) =>{
    try{ 
        const {email} = req.body;
        if(email === ''){
            return res.status(400).json({msg : "email required"})
        } 
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(403).json({msg : "email not in db"});
        }
        const token = crypto.randomBytes(20).toString('hex')
        await User.updateOne({_id : user._id}, {
            resetPasswordToken : token,
            resetPasswordExpires : Date.now() + 3600000
        })
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : `${process.env.EMAIL_ADDRESS}`,
                pass : `${process.env.EMAIL_PASSWORD}`
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        const mailOptions = {
            from : 'voterbox2021@gmail.com',
            to : `${user.email}`,
            subject : 'Link to Reset Password',
            text : 
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                +'Please click on the following link or paste this into yur browser to complete reset password process within one hour of receiving it:\n\n'
                +`http://localhost:3000/resetPassword?${token}\n\n`
                +'If you did not requested it, please ignore this email and password will remain unchanged\n'
        }
        transporter.sendMail(mailOptions, (err,response) =>{
            if(err){
                res.status(500).json({msg : "Something went wrong"})
            }else{
                res.status(200).json({msg : 'recovery email sent'});
            }
        })
    }catch(err){
        res.status(500).json({msg : "Something went wrong" })
    }
})

router.get('/resetPassword', async (req,res,next) =>{
    try{
        const resetPasswordToken = req.query.resetPasswordToken;
        const user = await User.findOne({
            resetPasswordToken : resetPasswordToken,
            resetPasswordExpires : {
                $gt : Date.now(),
            }
        })     
        if(!user){
            return res.status(404).json({msg : 'password reset link is invalid or has expired'})
        }
        console.log(user.email)
        res.status(200).send({
            email : user.email,
            msg : 'password reset link a-ok'
        })
    }catch(err){
        res.status(500).json({msg : "Something went wrong"})
    }
})

router.patch('/updatePassword/', async (req,res,next) =>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(404).json({msg : 'No user exists in database to update'})
        }
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,salt)
        const updatedUser = await User.updateOne({email : email}, {
            password : passwordHash,
            resetPasswordExpires : Date.now(),
            resetPasswordToken : ""
        })
        res.status(200).json({msg : 'password updated'})
    }catch(err){
        res.status(500).json({msg : "Something went wrong"})
    }
})
module.exports = router