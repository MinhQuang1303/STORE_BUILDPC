require('dotenv').config();
const mongoose = require('mongoose');

// Import all models to prevent MissingSchemaError
require('./src/models/User');
require('./src/models/SanPham');
require('./src/models/BienThe');
require('./src/models/OrderItem');
require('./src/models/Order');

const orderService = require('./src/services/orderService');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc-builder')
  .then(async () => {
    try {
      console.log('Fetching orders...');
      const d = await orderService.layDanhSachOrder();
      console.log('Successfully fetched', d.length, 'orders');
      if (d.length > 0) {
          console.log('First order ID:', d[0]._id.toString());
          console.log('First order user:', d[0].idUser ? d[0].idUser.username : 'null');
      }
    } catch (e) {
      console.error('ERROR IN SERVICE:', e);
    }
    process.exit(0);
  });
