const express= require("express")
const mongoose= require("mongoose")
const cors= require("cors")
const bcrypt= require("bcryptjs")

const users= require("./models/blog")

const app= express()
// middleware function
app.use(cors())  
app.use(express.json())

// password hashing (encryption)...async....salt-rang(4-31) best is 8 or 10
const generateHashedPassword= async (password)=>{
    const salt= await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}


mongoose.connect("mongodb+srv://abhishikth:achuMon0075@cluster0.38fgaky.mongodb.net/blogDb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",async(req,res)=>{

    let input= req.body
    let hashedPassword= await generateHashedPassword(input.password)
    input.password= hashedPassword //if not this password will be plain text
    let user= new users.userModel(input)
    user.save()
    console.log(hashedPassword)
    res.json({"status":"success"})

})

app.listen(8080,()=>{
    console.log("server started")
})