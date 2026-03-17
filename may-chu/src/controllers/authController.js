const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');

// 1. [POST] Đăng ký - Đã sửa lỗi Duplicate Key và dọn dẹp code thừa
exports.dangKy = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const userTonTai = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (userTonTai) {
            return res.status(400).json({
                message: userTonTai.email === email
                    ? "Email này đã được sử dụng!"
                    : "Tên đăng nhập đã tồn tại!",
            });
        }

        // Tạo user mới
        const userMoi = new User({
            username,
            email,
            password,
            role: role || "user",
        });

        await userMoi.save();
        res.status(201).json({ message: "Đăng ký tài khoản thành công!" });

    } catch (error) {
        // Xử lý lỗi trùng lặp (Duplicate Key) từ MongoDB nếu lọt qua bước check trên
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Dữ liệu bị trùng (Email hoặc Username đã tồn tại)!" 
            });
        }
        res.status(500).json({ message: "Lỗi server khi đăng ký", error: error.message });
    }
};

// 2. [POST] Đăng nhập
exports.dangNhap = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // So sánh mật khẩu (Hàm comparePassword định nghĩa trong Model User)
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "chuoi_ky_tu_bi_mat_bat_ky",
            { expiresIn: "1d" },
        );

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập", error: error.message });
    }
};

// 3. [POST] Quên mật khẩu - Gửi mã xác nhận qua Email
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

        // Tạo token ngẫu nhiên để khôi phục
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Hash token và lưu vào DB để đối chiếu sau này
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

        await user.save({ validateBeforeSave: false });

        // Link dẫn đến trang Frontend đặt lại mật khẩu
        const resetUrl = `http://localhost:3000/dat-lai-mat-khau/${resetToken}`;
        
        const htmlMessage = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2>Yêu cầu đặt lại mật khẩu</h2>
                <p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản <b>STORE BUILD PC</b>.</p>
                <p>Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
                <a href="${resetUrl}" style="background: #00f2fe; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ĐẶT LẠI MẬT KHẨU</a>
                <p style="margin-top: 20px; color: #666; font-size: 12px;">Link này có hiệu lực trong 10 phút. Nếu không yêu cầu, bạn có thể bỏ qua email này.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Khôi phục mật khẩu - STORE BUILD PC',
            html: htmlMessage
        });

        res.status(200).json({ message: 'Link đặt lại mật khẩu đã được gửi vào Gmail của bạn!' });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi gửi email", error: err.message });
    }
};

// 4. [PATCH] Đặt lại mật khẩu mới
exports.resetPassword = async (req, res) => {
    try {
        // Tìm user có token khớp và chưa hết hạn
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Link khôi phục không hợp lệ hoặc đã hết hạn!" });
        }

        // Cập nhật mật khẩu mới (Mật khẩu sẽ được hash tự động ở Model.pre('save'))
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Mật khẩu của bạn đã được cập nhật thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu" });
    }
};