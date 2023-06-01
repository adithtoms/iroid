import mongoose from 'mongoose'

const url='mongodb+srv://adithtoms:z-c7zpUNbW9WQZe@cluster0.ufs2fwk.mongodb.net/iroiduser'


mongoose.connect(url,{useUnifiedTopology:true, useNewUrlParser:true})

var db=mongoose.connection

db.on('connected',()=>{
    console.log("MongoDB connection successfull");
})

db.on('error',()=>{
    console.log("MongoDB connection failed");
})

const userSchema = mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    token:String
})

const User= mongoose.model('User', userSchema)

export default User