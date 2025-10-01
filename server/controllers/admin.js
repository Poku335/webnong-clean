const prisma = require("../config/prisma")

exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body
        
        const orderUpdate = await prisma.order.update({
            where: { id: orderId },
            data: { 
                orderStatus: orderStatus,
                paymentStatus: orderStatus === "ชำระเงินแล้ว" ? "complete" : "pending"
            }
        })

        // If status is "ชำระเงินแล้ว", update product quantities
        if (orderStatus === "ชำระเงินแล้ว") {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { productsOnOrders: true }
            })

            if (order) {
                await Promise.all(
                    order.productsOnOrders.map((item) =>
                        prisma.product.update({
                            where: { id: item.productId },
                            data: {
                                quantity: { decrement: item.count },
                                sold: { increment: item.count },
                            },
                        })
                    )
                )
            }
        }

        res.json(orderUpdate)
    } catch (err) {
        console.error('Order status change error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
exports.getOrderAdmin = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                productsOnOrders: {
                    include: {
                        product: true
                    }
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        fullName: true,
                        address: true,
                    }
                }
            }
        })
        
        // Map orders to include paymentSlip and convert orderStatus
        const mappedOrders = orders.map(order => ({
            ...order,
            orderStatus: order.paymentMethod === "QR Code" && order.paymentStatus === "pending" 
                ? "รอดำเนินการ" 
                : order.paymentMethod === "QR Code" && order.paymentStatus === "complete"
                ? "ชำระเงินแล้ว"
                : order.paymentMethod === "ปลายทาง"
                ? "ชำระเงินแล้ว"
                : "รอดำเนินการ",
            // Include paymentSlip for QR Code payments
            paymentSlip: order.paymentMethod === "QR Code" ? order.paymentSlip : null,
            // Include QR code image for QR Code payments
            qrCodeImage: order.paymentMethod === "QR Code" ? order.qrCodeImage : null
        }))
        
        res.json(mappedOrders)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

// Get payment orders for admin
exports.getPaymentOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                paymentMethod: "QR Code"
            },
            orderBy: { createdAt: 'desc' },
            include: {
                productsOnOrders: {
                    include: {
                        product: true
                    }
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        fullName: true,
                        address: true,
                    }
                }
            }
        })
        res.json(orders)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body
        
        const orderUpdate = await prisma.order.update({
            where: { id: orderId },
            data: { 
                paymentStatus: paymentStatus,
                orderStatus: paymentStatus === "complete" ? "Completed" : "Pending"
            }
        })

        // If payment is complete, update product quantities and clear cart
        if (paymentStatus === "complete") {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { productsOnOrders: true }
            })

            if (order) {
                await Promise.all(
                    order.productsOnOrders.map((item) =>
                        prisma.product.update({
                            where: { id: item.productId },
                            data: {
                                quantity: { decrement: item.count },
                                sold: { increment: item.count },
                            },
                        })
                    )
                )
            }
        }

        res.json(orderUpdate)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}