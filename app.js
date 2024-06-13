const express= require("express")
const mongoose= require("mongoose")
const cors= require("cors")
const bcrypt= require("bcryptjs")


const users= require("./models/blog")
const {userModel}= require("./models/blog")
const jwt= require("jsonwebtoken")

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

//for signin
app.post("/signin",(req,res)=>{
    let input= req.body
userModel.find({"email":req.body.email}).then((response)=>{
    if (response.length>0) {
        let dbPassword= response[0].password
        console.log(dbPassword)
        bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
            if (isMatch) {
               jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},(error,token)=>{
                if (error) {
                    res.json({"status":"token not generated"})
                } else {
                    res.json({"status":"success","userId":response[0]._id,"token":token})
                }
               })
            } else {
                res.json({"status":"incorrect"})
            }
        })
        
    } else {
        res.json({"status":"user not found"})
    }
}).catch()
})

app.post("/viewusers",(req,res)=>{
     let token= req.headers["token"]
     jwt.verify(token,"blog-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorized access"})
        } else {
            if (decoded) {
                userModel.find().then(
                    (data)=>{
                        res.json(data)
                    }
                ).catch()
            } 
            
            
        }
     })
})

app.listen(8081,()=>{
    console.log("server started")
})