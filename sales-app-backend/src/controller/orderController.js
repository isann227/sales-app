const { Prisma } = require('@prisma/client');
const prisma = require('../prisma');


const createOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, paymentType } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items tidak boleh kosong" });
    }

    // ambil data produk dari DB
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // mapping item dengan harga & subtotal dari DB
    const orderItems = items.map(i => {
      const product = products.find(p => p.id === i.productId);
      if (!product) throw new Error(`Produk dengan ID ${i.productId} tidak ditemukan`);

      const price = new Prisma.Decimal(product.price);
      const quantity = new Prisma.Decimal(i.quantity);
      const subtotal = price.mul(quantity);

      return {
        productId: i.productId,
        quantity: i.quantity,
        price,
        subtotal,
      };
    });

    // hitung totalAmount
    const totalAmount = orderItems.reduce(
      (acc, item) => acc.add(item.subtotal),
      new Prisma.Decimal(0)
    );

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        totalAmount,
        deliveryMethod,
        paymentType,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    res.json(order);
  } catch (err) {
    console.error("Error createOrder:", err);
    res.status(500).json({ error: "Gagal membuat order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error getOrders:", error);
    res.status(500).json({ error: "Gagal mengambil data orders", detail: error.message });
  }
};

module.exports = { createOrder, getOrders };
