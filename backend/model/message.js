const {DataTypes}=require("sequelize")
const sequelize=require("../config/db")


const Messages=sequelize.define("Messages",{
message:{
    type:DataTypes.STRING
    ,allowNull:false

}},{

timestamps:true,

})


module.exports=Messages