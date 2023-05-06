const express = require("express")
const swaggerUi = require("swagger-ui-express");
const {swaggerSpec} = require('../Swagger/swagger')
const router = express.Router()
const {createUser,loginUser, getUserDetailsById,updateUser}= require('../Controllers/userController')
const {createAdmin, loginAdmin,getAllUsers} = require("../Controllers/adminController")
const {createProduct, getProducts, updateProduct, deleteProductById} = require("../Controllers/productController")
const {authentication} = require("../Middleware/auth")


//////////////////////////swagger//////////////////////////////////////////
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//////////////////////User Api//////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /register:
 *  post: 
 *      description: user resgitration
 *      responses: 
 *       '201': 
 *       description: resgitration successfull 
 */
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