const Messages=require("../model/message")
const User=require("../model/user")


const createMessage= async (req,res)=>{
    try{
        const {message}=req.body
        const UserId=req.user.id
        const newMessage=await Messages.create({message,UserId})
        res.status(200).json({success:true,message:"new message has been created",newMessage})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


const getMessage=async(req,res)=>{
    try{
        const allmessages=await Messages.findAll({
            include:[{model:User,attributes:["id","name","email"]}],
            order:[["createdAt","ASC"]]
        })
        res.status(200).json({allmessages})

    }catch(err){
res.status(500).json({message:err.message})
    }
}

module.exports={createMessage,getMessage}