const jwt=require("jsonwebtoken")


const authorization= async(req,res,next)=>{
    try{
        const authHeaders=req.headers.authorization
        if(!authHeaders||!authHeaders.startsWith("Bearer")){
            return res.status(400).json({message:"token not recieved"})

        }
        const token=authHeaders.split(" ")[1]
        const tokenverification=jwt.verify(token,"secretkey")
        req.user=tokenverification
        next()



    }catch(err){

res.status(500).json({message:err.message})
    }
}

module.exports=authorization