const express = require('express')
const router = express.Router()
const { create, list, update, remove } = require('../controllers/category')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
// const prisma = require('../prismaClient.js";')

// @ENDPOINT http://localhost:5001/api/category
router.post('/category', authCheck, adminCheck, create)
router.get('/category', list)
router.put('/category/:id', authCheck, update)
router.delete('/category/:id', authCheck, adminCheck, remove)






module.exports = router