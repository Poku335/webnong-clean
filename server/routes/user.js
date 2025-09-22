const express = require('express')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/authCheck')
const { finalizeOrderAndClearCart } = require("../controllers/user");
const prisma = require("../config/prisma");
const {
    listUsers,
    changeStatus,
    changeRole,
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    saveOrder,
    getOrder,
    getUserAddresses,
    saveUserAddress,
    updateUserAddress,
    deleteUserAddress,
    updateUserProfile
} = require('../controllers/user')

router.post("/user/finalize-order", authCheck, finalizeOrderAndClearCart);
router.get('/users', authCheck, adminCheck, listUsers)
router.post('/change-status', authCheck, adminCheck, changeStatus)
router.post('/change-role', authCheck, adminCheck, changeRole)


router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)

router.post('/user/address', authCheck, saveAddress)

// User Address Management
router.get('/user/addresses', authCheck, getUserAddresses)
router.post('/user/addresses', authCheck, saveUserAddress)
router.put('/user/addresses/:id', authCheck, updateUserAddress)
router.delete('/user/addresses/:id', authCheck, deleteUserAddress)

// User Profile Management
router.put('/user/profile', authCheck, updateUserProfile)

router.post('/user/order', authCheck, saveOrder)
router.get('/user/order', authCheck, getOrder)




module.exports = router