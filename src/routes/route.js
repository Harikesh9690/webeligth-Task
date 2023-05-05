const express = require("express")
const router = express.Router()
const {createUser,loginUser, getUserDetailsById,updateUser}= require('../Controllers/userController')

router.post('/resgister', createUser)
router.post('/login', loginUser)
router.get('/user/:userId', getUserDetailsById)
router.put('/user/:userId', updateUser)

module.exports = router