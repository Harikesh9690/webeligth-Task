const adminModel = require("../Models/adminModel")
const userModel = require("../Models/userModel")
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const { isValid, isValidName, isvalidEmail, isvalidMobile, isValidPassword,  keyValid, validString } = require('../validator/validations');


const createAdmin = async function (req, res) {
    try {
        const data = req.body
        const { fname, lname, email, password, phone,empId } = data;


        if (!isValid(fname)) return res.status(400).send({ status: false, message: "fname is mandatory and should have non empty String" })

        if (!isValid(lname)) return res.status(400).send({ status: false, message: "lname is mandatory and should have non empty String" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is mandatory and should have non empty String" })

        if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })

        if (await adminModel.findOne({ email })) return res.status(400).send({ status: false, message: "This email is already Registered Please give another Email" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone is mandatory and should have non empty Number" })

        if (!isvalidMobile.test(phone)) return res.status(400).send({ status: false, message: "please provide Valid phone Number with 10 digits starts with 6||7||8||9" })

        if (await adminModel.findOne({ phone })) return res.status(400).send({ status: false, message: "This Phone is already Registered Please give another Phone" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is mandatory and should have non empty String" })

        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please provide Valid password with 1st letter should be Capital letter and contains spcial character with Min length 8 and Max length 15" })

        if(!isValid(empId)) return  res.status(400).send({ status: false, message: "Employee Id is mandatory and should have non empty String" })
        
        const encyptPassword = await bcrypt.hash(password, 10);
        let obj = {
            fname, lname, email,phone, password: encyptPassword, empId}

        const newAdmin = await adminModel.create(obj)

        return res.status(201).send({ status: true, message: "Admin created successfully", data: newAdmin })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////

const loginAdmin = async function (req, res) {
    try {
        let data = req.body
        const { empId, password } = data
        //=====================Checking the validation=====================//
        if (!keyValid(data)) return res.status(400).send({ status: false, msg: "Employee Id and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!empId) return res.status(400).send({ status: false, msg: "Employee Id is required" })


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        //===================== Checking User exsistance using Email and password=====================//
        const admin = await adminModel.findOne({ empId: empId })
        if (!admin) return res.status(400).send({ status: false, msg: "Employee Id is Invalid Please try again !!" })

        const verifyPassword = await bcrypt.compare(password, admin.password)

        if (!verifyPassword) return res.status(400).send({ status: false, msg: "Password is Invalid Please try again !!" })


        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            empId: admin.empId.toString()
             }, 
        "this is a private key", { expiresIn: '1d' })

        res.setHeader("x-api-key", token)

       

        res.status(200).send({ status: true, message: "Admin login successfull", data: token })

    }
     catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

/////////////////////////////////////get All Users//////////////////////////////////////////////////////////////

let getAllUsers  = async (req, res) => {
    try {
        const AdminEmployeeId = req.params.empId
        const decodedToken = req.decodedToken

        //if (!isValidObjectId(UserIdData)) return res.status(400).send({ status: false, message: 'userId is not valid' })

        let admin = await adminModel.findOne({empId:AdminEmployeeId})

        if (!admin) return res.status(404).send({ status: false, messgage: ' Admin data not found' })

        if (AdminEmployeeId !== decodedToken.empId) return res.status(401).send({ status: false, messgage: 'Unauthorized access!' })
        let users= await userModel.find().select({password:0})
        return res.status(200).send({ status: true, message: 'User profile details', data: users })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



module.exports=  {createAdmin,loginAdmin,getAllUsers}