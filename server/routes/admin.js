// import ....
const express = require('express')
const { authCheck } = require('../middlewares/authCheck')
const router = express.Router()
// import controller
const { getOrderAdmin, changeOrderStatus, getPaymentOrders, updatePaymentStatus } = require('../controllers/admin')


router.put('/admin/order-status', authCheck, changeOrderStatus)
router.get('/admin/orders', authCheck, getOrderAdmin)
router.get('/admin/payment-orders', authCheck, getPaymentOrders)
router.put('/admin/payment-status', authCheck, updatePaymentStatus)


module.exports = router