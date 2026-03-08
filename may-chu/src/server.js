const express = require('express');
const cors = require('cors');
const database = require('./config/ket-noi-mongodb');
const sanPhamRoute = require('./routes/sanPhamRoute');

class Server {
    constructor() {
        this.app = express();
        this.port = 5000;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        // Sử dụng route đã tách ra theo chuẩn MVC
        this.app.use('/api/san-pham', sanPhamRoute);
        
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

const server = new Server();
server.start();