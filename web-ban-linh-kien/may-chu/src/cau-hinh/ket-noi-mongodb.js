const mongoose = require('mongoose');

const ketNoiDB = async () => {
    try {
        // 127.0.0.1 là địa chỉ máy cục bộ của bạn
        // 'web_build_pc' là tên database (nó sẽ tự tạo nếu chưa có)
        const uri = 'mongodb://127.0.0.1:27017/web_build_pc';
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB: Đã kết nối thành công!');
    } catch (error) {
        console.error('❌ MongoDB: Kết nối thất bại!', error.message);
        process.exit(1);
    }
};

module.exports = ketNoiDB;