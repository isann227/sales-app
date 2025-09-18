const prisma = require('../prisma');

const getCart = async (req, res) => {
  const cart = await prisma.cart.findMany({
    where: { userId: req.user.id },
    include: { product: true }
  });
  res.json(cart);
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  // cek apakah product sudah ada di cart user
  let cartItem = await prisma.cart.findFirst({
    where: { userId, productId }
  });

  if (cartItem) {
    cartItem = await prisma.cart.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + quantity }
    });
  } else {
    cartItem = await prisma.cart.create({
      data: { userId, productId, quantity }
    });
  }

  res.json(cartItem);
};

module.exports = { getCart, addToCart };
