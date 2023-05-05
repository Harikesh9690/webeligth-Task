const mongoose= require("mongoose");

const adminSchema = new mongoose.Schema({
    fname: {
        type:String, 
        required:true,
        trim:true
    },
    lname: {
        type:String, 
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true
    }, 
    password: {
        type:String, 
        required:true,
        trim:true
    }, // encrypted password

    phone: {
        type:String, 
        required:true,
        unique:true,
        trim:true
    }, 
   empId: {
    type : String,
    requred: true,
    unique: true
    }
   
},{timestamps:true})


module.exports = mongoose.model("admin", adminSchema)