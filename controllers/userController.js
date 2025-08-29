// const { sign } = require("jsonwebtoken")
const User=require("../model/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")




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


const login=async(req,res)=>{
    try{ 
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"fields cant be empty"})
        }
        const existinguser=await User.findOne({where:{email}})
        if(!existinguser){
            return res.status(400).json({message:"Register to login"})
        }

        const passwordmatch=await bcrypt.compare(password,existinguser.password)

        if(!passwordmatch){
            return res.status(400).json({message:"password does not match"})
        }
        const token=await jwt.sign({id:existinguser.id},"secretkey",{expiresIn:"1h"})
        res.status(200).json({success:true,message:"user logged in succesfully",token:token})
    }catch(err){
return res.status(500).json({message:err.message})
    }
}


const getUsers=async(req,res)=>{
try{
    const users=await User.findAll()
    res.status(200).json({success:true,message:"Users has been fetched",users})


}catch(err){
    res.status(500).json({message:err.message})

}


}
module.exports={signup,login,getUsers}