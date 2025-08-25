const {Sequelize}=require("sequelize")
const db=new Sequelize("groupchatdb","root","Manthan123",{
    host:"localhost",
    dialect:"mysql"

})

db.authenticate()
.then(()=>{console.log("db is connected")})
.catch((err)=>{console.log(err)})

module.exports=db