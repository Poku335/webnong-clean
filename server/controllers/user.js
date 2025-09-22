const prisma = require("../config/prisma");

// 🔧 Helper function สำหรับสร้าง order และล้าง cart
async function createOrderFromCart(userId, options = {}) {
  const cart = await prisma.cart.findFirst({
    where: { orderedById: userId },
    include: { productsOnCarts: true },
  });

  if (!cart || cart.productsOnCarts.length === 0) {
    throw new Error("Cart is empty");
  }

  const amount = options.amount || cart.cartTotal;
  const status = options.status || "Completed";
  const currency = options.currency || "THB";
  const orderStatus = options.orderStatus || "Completed";

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
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
        amount,
        status,
        currentcy: currency,
        orderStatus,
      },
    });

    await Promise.all(
      cart.productsOnCarts.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.count },
            sold: { increment: item.count },
          },
        })
      )
    );

    await tx.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: userId,
        },
      },
    });

    await tx.cart.deleteMany({
      where: {
        orderedById: userId,
      },
    });

    return createdOrder;
  });

  return order;
}


// 🧑‍💼 ผู้ใช้
exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, enabled: true, address: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    await prisma.user.update({ where: { id: Number(id) }, data: { enabled } });
    res.send("Update Status Success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    await prisma.user.update({ where: { id: Number(id) }, data: { role } });
    res.send("Update Role Success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🛒 ตะกร้า
exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = Number(req.user.id);

    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true },
      });
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย สินค้า ${product?.title || "product"} หมดแล้ว`,
        });
      }
    }

    await prisma.productOnCart.deleteMany({
      where: { cart: { orderedById: userId } },
    });

    await prisma.cart.deleteMany({ where: { orderedById: userId } });

    const products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    const cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0);

    await prisma.cart.create({
      data: {
        productsOnCarts: { create: products },
        cartTotal,
        orderedById: userId,
      },
    });

    res.send("Add Cart Ok");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: {
        productsOnCarts: { include: { product: true } },
      },
    });

    res.json({
      products: cart?.productsOnCarts || [],
      cartTotal: cart?.cartTotal || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
    });

    if (!cart) {
      return res.status(400).json({ message: "No cart" });
    }

    await prisma.productOnCart.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });

    res.json({ message: "Cart Empty Success", deletedCount: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🏠 ที่อยู่
exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    await prisma.user.update({
      where: { id: Number(req.user.id) },
      data: { address },
    });
    res.json({ ok: true, message: "บันทึกที่อยู่สำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.saveOrder = async (req, res) => {
  try {
    const { amount, status, currency } = req.body.paymentIntent;
    const amountTHB = Number(amount) / 100;

    const order = await createOrderFromCart(req.user.id, {
      amount: amountTHB,
      status,
      currency,
    });

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

// ✅ Finalize order แบบ bypass
exports.finalizeOrderAndClearCart = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const cart = await prisma.cart.findFirst({
      where: { orderedById: userId },
      include: { productsOnCarts: true },
    });

    if (!cart || cart.productsOnCarts.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is empty" });
    }

    // ✅ ตรวจสอบสต็อกล่าสุดก่อนตัดสต็อก/สร้างออเดอร์ (กันเคสสต็อกไม่พอ)
    for (const item of cart.productsOnCarts) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { quantity: true, title: true },
      });
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย สินค้า ${product?.title || "product"} หมดหรือสต็อกไม่พอ`,
        });
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      // ✅ สร้าง order
      const createdOrder = await tx.order.create({
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

      // ✅ อัปเดต stock
      await Promise.all(
        cart.productsOnCarts.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.count },
              sold: { increment: item.count },
            },
          })
        )
      );

      // ✅ ลบ product ใน cart ด้วย cartId
      await tx.productOnCart.deleteMany({
        where: { cartId: cart.id },
      });

      // ✅ ลบตัว cart ออก
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return createdOrder;
    });

    // ✅ ตอบกลับพร้อมสถานะตะกร้าว่าง เพื่อให้ฝั่ง client เคลียร์ state ได้แน่นอน
    res.json({
      ok: true,
      message: "Order finalized and cart cleared",
      order,
      cart: { products: [], cartTotal: 0 },
    });
  } catch (err) {
    console.error("Error finalizing order:", err);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};






// 📜 ดูประวัติออเดอร์
exports.getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      orderBy: { createdAt: "desc" },
      include: {
        productsOnOrders: { include: { product: { include: { images: true } } } },
      },
    });

    if (orders.length === 0) {
      return res.status(400).json({ ok: false, message: "No orders" });
    }

    res.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🏠 จัดการที่อยู่ผู้ใช้
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: Number(req.user.id) },
      orderBy: { isDefault: "desc" },
    });
    res.json({ ok: true, addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.saveUserAddress = async (req, res) => {
  try {
    const { fullName, phone, address, postalCode, isDefault } = req.body;
    const userId = Number(req.user.id);

    // ตรวจสอบจำนวนที่อยู่ที่มีอยู่
    const existingAddresses = await prisma.userAddress.count({
      where: { userId }
    });

    if (existingAddresses >= 5) {
      return res.status(400).json({ 
        ok: false, 
        message: "ถึงขีดจำกัดการบันทึกที่อยู่แล้ว (สูงสุด 5 ที่อยู่)" 
      });
    }

    // ถ้าเป็น default ให้ยกเลิก default ของที่อยู่อื่นๆ
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        fullName,
        phone,
        address,
        postalCode,
        isDefault: isDefault || false,
        userId
      }
    });

    res.json({ ok: true, message: "บันทึกที่อยู่สำเร็จ", address: newAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, postalCode, isDefault } = req.body;
    const userId = Number(req.user.id);

    // ตรวจสอบว่าที่อยู่นี้เป็นของ user นี้หรือไม่
    const existingAddress = await prisma.userAddress.findFirst({
      where: { id: Number(id), userId }
    });

    if (!existingAddress) {
      return res.status(404).json({ ok: false, message: "ไม่พบที่อยู่" });
    }

    // ถ้าเป็น default ให้ยกเลิก default ของที่อยู่อื่นๆ
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, id: { not: Number(id) } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id: Number(id) },
      data: {
        fullName,
        phone,
        address,
        postalCode,
        isDefault: isDefault || false
      }
    });

    res.json({ ok: true, message: "อัปเดตที่อยู่สำเร็จ", address: updatedAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.user.id);

    // ตรวจสอบว่าที่อยู่นี้เป็นของ user นี้หรือไม่
    const existingAddress = await prisma.userAddress.findFirst({
      where: { id: Number(id), userId }
    });

    if (!existingAddress) {
      return res.status(404).json({ ok: false, message: "ไม่พบที่อยู่" });
    }

    await prisma.userAddress.delete({
      where: { id: Number(id) }
    });

    res.json({ ok: true, message: "ลบที่อยู่สำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 👤 อัปเดตข้อมูลผู้ใช้
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const userId = Number(req.user.id);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone
      },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        phone: true,
        role: true
      }
    });

    res.json({ ok: true, message: "อัปเดตข้อมูลสำเร็จ", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

