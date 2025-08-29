const express=require("express")
const Router=express.Router()
const userController=require("../controllers/userController")


Router.post("/signup",userController.signup)
Router.post("/login",userController.login)
Router.get("/users",userController.getUsers)


module.exports=Router