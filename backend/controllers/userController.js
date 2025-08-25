// const { sign } = require("jsonwebtoken")
const User=require("../model/user")
const bcrypt=require("bcrypt")
const signup=async(req,res)=>{
    try{
        const {name,email,phonenumber,password}=req.body
        if (!name||!email||!phonenumber||!password){
            return res.status(400).json({message:"fields cant be empty"})

        }
        const existinguser=await User.findOne({where:{email}})
        if(existinguser){
            return res.status(400).json({message:"user already registered"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=await User.create({name,email,phonenumber,password:hashedPassword})
        res.status(200).json({success:true,message:"user created successfully"})

    }catch(err){
        res.status(500).json({message:err.message})

    }
}

module.exports={signup}