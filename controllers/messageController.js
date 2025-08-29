const Messages=require("../model/message")
const User=require("../model/user")
const { Op } = require("sequelize");


const createMessage= async (req,res)=>{
    try{
        const {message}=req.body
        const UserId=req.user.id
        const newMessage=await Messages.create({message,UserId})
        const fullMessage = await Messages.findOne({
      where: { id: newMessage.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
        res.status(200).json({success:true,message:"new message has been created",newMessage:fullMessage})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


const getMessage=async(req,res)=>{
    try{
        const lastId=req.query.lastId
        const allmessages=await Messages.findAll({
            where:{id:{[Op.gt]:lastId}},
            include:[{model:User,attributes:["id","name","email"]}],
            order:[["createdAt","ASC"]]
        })
        res.status(200).json({success:true,allmessages})

    }catch(err){
res.status(500).json({message:err.message})
    }
}

module.exports={createMessage,getMessage}