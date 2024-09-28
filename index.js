const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const mongoose = require('mongoose');
app.use(express.json())
const auth = require('./routes/authRoutes')
const product = require('./routes/productRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const cart = require('./routes/cartRoutes');
const users = require('./routes/userRoutes');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth',auth)
app.use('/product',authenticateToken,product)
app.use('/cart',authenticateToken,cart)
app.use('/users',users)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
