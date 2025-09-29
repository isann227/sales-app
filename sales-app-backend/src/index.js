require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRouter');
// const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const companyRoutes = require('./routes/company');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use('/api/company', companyRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get('/', (req, res) => res.json({ ok: true, message: 'Sales App Backend' }));


app.listen(port, () => console.log(`Server running on port ${port}`));