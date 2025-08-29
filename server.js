const express=require("express")
const app=express()
const userRoutes=require('./routes/userRoutes')
const messageRoutes=require("./routes/messageRoutes")
const db=require("./config/db")
const cors=require("cors")
const Messages=require("./model/message")
const User=require("./model/user")
const Group = require("./model/group");
const GroupMember = require("./model/groupmember");
const groupRoutes = require("./routes/groupRoutes");




// Associations
User.hasMany(Messages, { foreignKey: "UserId" });
Messages.belongsTo(User, { foreignKey: "UserId" });

// Group <-> User (many-to-many via GroupMember)
Group.belongsToMany(User, { through: GroupMember, foreignKey: "groupId" });
User.belongsToMany(Group, { through: GroupMember, foreignKey: "UserId" });

// Group <-> Message (one-to-many)
Group.hasMany(Messages, { foreignKey: "groupId" });
Messages.belongsTo(Group, { foreignKey: "groupId" });

Group.hasMany(GroupMember, { foreignKey: "groupId" });
GroupMember.belongsTo(Group, { foreignKey: "groupId" })

User.hasMany(GroupMember, { foreignKey: "UserId" });
GroupMember.belongsTo(User, { foreignKey: "UserId" });





app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use("/api/user",userRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/groups", groupRoutes);







db.sync({alter:true})
.then(()=>{
    console.log("db is synced")
    app.listen(3000,()=>{
        console.log("app is running on the port 3000")
    })

})
.catch((err)=>{
    console.log(err)
})





