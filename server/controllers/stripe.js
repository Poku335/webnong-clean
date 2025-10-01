const prisma = require("../config/prisma");

exports.payment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, qrCodeImage, paymentSlip, paymentStatus } = req.body;

    const cart = await prisma.cart.findFirst({
      where: { orderedById: userId },
      include: { productsOnCarts: true },
    });

    if (!cart || cart.productsOnCarts.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is empty" });
    }

    // Determine order status based on payment method
    let orderStatus = "Completed";
    let status = "Completed";
    
    if (paymentMethod === "QR Code") {
      orderStatus = "Pending";
      status = "Pending";
    }

    const order = await prisma.order.create({
      data: {
        productsOnOrders: {
          create: cart.productsOnCarts.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: { connect: { id: userId } },
        cartTotal: cart.cartTotal,
        amount: cart.cartTotal,
        status: status,
        currentcy: "THB",
        orderStatus: orderStatus,
        paymentMethod: paymentMethod || "ปลายทาง",
        paymentStatus: paymentStatus || "complete",
        qrCodeImage: qrCodeImage || null,
        paymentSlip: paymentSlip || null,
      },
    });

    // Only update product quantities and clear cart for completed payments
    if (paymentMethod !== "QR Code") {
      await Promise.all(
        cart.productsOnCarts.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.count },
              sold: { increment: item.count },
            },
          })
        )
      );

      await prisma.productOnCart.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.delete({ where: { id: cart.id } });
    }

    res.json({ ok: true, order });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};
