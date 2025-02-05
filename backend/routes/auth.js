const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

//Register User
router.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;

    try{
        let user = await User.findOne({email})
        if (user){
            return res.status(400).json({msg:"User already exist"})
        }
        //create new user
        user = new User({
            email,name,password
        })
        //encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hasg(password,salt);

        await user.save()

        //create token
        const payload={user:{
            id:user.id
        }}
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:3600})
        res.json({token})
    }catch(err){
        console.error(err.message)
        res.status(500).send(`server error`)
    }
})

//login Route

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    try{
        //check if user exits
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:'invalid credentials'})
        }
        //compare password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"invalid"})
        }
        //create toekn 
        const payload = { user : {id:user.id}}
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:3600})
        res.json({token})
    } catch (error){
        console.error(error)
        res.status(500).send(`server error`)
    }
})

module.exports = router;