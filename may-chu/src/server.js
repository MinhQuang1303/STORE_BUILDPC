// may-chu/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Đừng quên nạp biến môi trường cho JWT_SECRET
const database = require('./config/ket-noi-mongodb');

// Import các Route
const sanPhamRoute = require('./routes/sanPhamRoute');
const authRoute = require('./routes/authRoute'); 

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;

        this.ketNoiDB(); // Kết nối database khi khởi tạo
        this.middlewares();
        this.routes();
    }

    async ketNoiDB() {
        // Giả sử file ket-noi-mongodb.js của bạn export một hàm kết nối
        // Nếu file đó tự kết nối rồi thì có thể bỏ qua bước này
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json()); // Để đọc dữ liệu JSON từ body request
    }

    routes() {
        // Sử dụng route theo chuẩn MVC
        this.app.use('/api/san-pham', sanPhamRoute);
        this.app.use('/api/auth', authRoute); // Route xác thực admin/user
        
        this.app.get('/', (req, res) => {
            res.send('Máy chủ Build PC đang hoạt động (Chuẩn OOP)!');
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Backend nổ máy tại: http://localhost:${this.port}`);
        });
    }
}

// Khởi chạy server
const server = new Server();
server.start();