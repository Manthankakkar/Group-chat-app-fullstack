const {DataTypes}=require("sequelize")
const Sequelize=require("../config/db")

const User=Sequelize.define("User",{

name:{
    type:DataTypes.STRING,
    allowNull:false
}
,email:{
    type:DataTypes.STRING,
    allowNull:false
}
,phonenumber:{
    type:DataTypes.BIGINT,
    allowNull:false
},
password:{
    type:DataTypes.STRING,
    allowNull:false
}

})

module.exports=User