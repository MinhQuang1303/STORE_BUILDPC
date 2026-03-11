const NguoiDung = require('../models/NguoiDung');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// [POST] Xử lý Đăng ký
exports.dangKy = async (req, res) => {
    try {
        const { ten, email, matKhau, vaiTro } = req.body;

        // 1. Kiểm tra email tồn tại
        const userTonTai = await NguoiDung.findOne({ email });
        if (userTonTai) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const matKhauDaMaHoa = await bcrypt.hash(matKhau, salt);

        // 3. Lưu người dùng mới
        const userMoi = new NguoiDung({
            ten,
            email,
            matKhau: matKhauDaMaHoa,
            vaiTro: vaiTro || 'user' 
        });

        await userMoi.save();
        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
    }
};

// [POST] Xử lý Đăng nhập
exports.dangNhap = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        const user = await NguoiDung.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
        }

        const matKhauDung = await bcrypt.compare(matKhau, user.matKhau);
        if (!matKhauDung) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
        }

        // Tạo Token
        const token = jwt.sign(
            { id: user._id, vaiTro: user.vaiTro },
            process.env.JWT_SECRET || 'chuoi_ky_tu_bi_mat_bat_ky',
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: {
                id: user._id,
                ten: user.ten,
                email: user.email,
                vaiTro: user.vaiTro
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: error.message });
    }
};