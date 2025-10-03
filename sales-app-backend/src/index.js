require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// middleware
app.use(cors());
app.use(express.json());
// Custom morgan to skip /image requests
// Serve static images before morgan logging so /image requests are not logged
app.use('/image', express.static(require('path').join(__dirname, '../public/image')));
app.use(morgan('dev'));
app.use('/image', express.static(require('path').join(__dirname, '../public/image')));


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
const wilayahRoutes = require('./routes/wilayahRoutes');

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
app.use("/api/wilayah", wilayahRoutes);


app.get('/', (req, res) => res.json({ ok: true, message: 'Sales App Backend' }));


app.listen(port, () => console.log(`Server running on port ${port}`));