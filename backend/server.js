const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/postRoutes")


const app  =express()

connectDB()

app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/posts",postRoutes)


app.get("/",(req,res)=>{
    res.send("blog platform api is running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server started in port ${PORT}`)
})