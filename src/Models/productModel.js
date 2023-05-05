const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
        name:{
            type:String, 
            required:true,
            unique:true,
            trim:true
        },
        description: {
            type:String, 
            required:true,
            trim:true
        },
        category:{
            type : String,
           required: true
        },
        price: {
            type:Number,
            required:true,
            trim:true
        },
        style:{
            type:String, 
            trim:true
        },
        availableSizes: {
            type:[String], 
            enum:["S", "XS","M","X", "L","XXL", "XL"],
            trim:true   
        }, 
        deletedAt: {
            type:String
        }, 
        isDeleted: {
            type:Boolean, 
            default:false
        } 
},{timestamps:true})


module.exports = mongoose.model("product", productSchema)