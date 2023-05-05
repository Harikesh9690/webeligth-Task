const express = require("express")
const router = express.Router()
const {createUser,loginUser, getUserDetailsById,updateUser}= require('../Controllers/userController')
const {createAdmin, loginAdmin,getAllUsers} = require("../Controllers/adminController")
const {createProduct, getProducts, updateProduct, deleteProductById} = require("../Controllers/productController")
const {authentication} = require("../Middleware/auth")


//////////////////////User Api//////////////////////////////////////////////////////////////////
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/user/:userId',authentication, getUserDetailsById)
router.put('/user/:userId',authentication, updateUser)

////////////////////////////////////Admin Api///////////////////////////////////////////////////
router.post("/registerAdmin", createAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/users/:empId/usersDetails",authentication, getAllUsers )

////////////////////////////////////Product Api//////////////////////////////////////////////////////////
router.post("/products/:empId",authentication,createProduct );
router.get("/products", authentication,getProducts);
router.put('/products/:empId/:productId',authentication, updateProduct)
router.delete("/products/:empId/:productId",authentication, deleteProductById);
module.exports = router