const express=require("express")
const app=express()
const userRoutes=require('./routes/userRoutes')
const db=require("./config/db")
const cors=require("cors")


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use("/api/user",userRoutes)


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





