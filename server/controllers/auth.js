const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        //code
        const { email, password, fullName, phone } = req.body

        // Step 1 Validate body
        if (!email) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมล' })
        }
        if (!password) {
            return res.status(400).json({ message: "กรุณากรอกรหัสผ่าน" })
        }
        if (!fullName) {
            return res.status(400).json({ message: "กรุณากรอกชื่อ-นามสกุล" })
        }
        
        // Validate phone number if provided
        if (phone && !/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 ตัว" })
        }

        // Step 2 Check Email in DB already ?
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            return res.status(400).json({ message: "อีเมลนี้มีอยู่ในระบบแล้ว" })
        }
        // Step 3 HashPassword
        const hashPassword = await bcrypt.hash(password, 10)

        // Step 4 Register
        await prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
                fullName: fullName,
                phone: phone
            }
        })


        res.send('Register Success')
    } catch (err) {
        // err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = async (req, res) => {
    try {
        //code
        const { email, password } = req.body
        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้' })
        }
        // Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' })
        }
        // Step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // Step 4 Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" })
            }
            res.json({ payload, token })

        })
    } catch (err) {
        // err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.currentUser = async (req, res) => {
    try {
        //code
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                fullName: true,
                phone: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
