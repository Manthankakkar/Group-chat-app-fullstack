const express=require("express")
const Router=express.Router()
const messageController=require("../controllers/messageController")
const authorization=require("../middlewares/authorization")


Router.post("/createMessage",authorization,messageController.createMessage)
Router.get("/getMessage",authorization,messageController.getMessage)


module.exports=Router