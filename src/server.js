// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const cateCarRoutes = require('./routes/catecarRoutes');
const productRoutes = require('./routes/productRoutes');
const unitRoutes = require('./routes/unitRoutes');
const repairContentRoutes = require('./routes/repairContentRoutes');
const carRoutes = require('./routes/carRoutes');
const statusRoutes = require('./routes/statusRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://excell-woad.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // 👈 cho phép gửi token
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Use routes
app.use('/api/catecar', cateCarRoutes);
app.use('/api/products', productRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/repair-contents', repairContentRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/accounts', accountRoutes);
app.get("/", (req, res) => {
    res.status(200).send("🚀 Bá Thành backend is running.");
});
// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/excel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('✅ Kết nối MongoDB thành công');
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   });
// })
// .catch(err => {
//   console.error('❌ Kết nối MongoDB thất bại', err);
// });
    mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');

    // 👇 FIX: Dùng server.listen thay vì app.listen
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});