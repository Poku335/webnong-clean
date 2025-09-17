const prisma = require("../config/prisma");

exports.payment = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { orderedById: userId },
      include: { productsOnCarts: true },
    });

    if (!cart || cart.productsOnCarts.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is empty" });
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
        status: "Completed",
        currentcy: "THB",
        orderStatus: "Completed",
         
        
      },
    });

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

    res.json({ ok: true, message: "Order created and cart cleared", order });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};
