const NguoiDung = require("../models/NguoiDung");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');

// 1. [POST] Đăng ký
exports.dangKy = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const nguoiDungTonTai = await NguoiDung.findOne({
            $or: [{ email }, { username }],
        });

        if (nguoiDungTonTai) {
            return res.status(400).json({
                message: nguoiDungTonTai.email === email
                    ? "Email này đã được sử dụng!"
                    : "Tên đăng nhập đã tồn tại!",
            });
        }

        const nguoiDungMoi = new NguoiDung({
            username,
            email,
            password,
            role: role || "user",
        });

        await nguoiDungMoi.save();
        res.status(201).json({ message: "Đăng ký tài khoản thành công!" });

    } catch (error) {
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
        
        const nguoiDung = await NguoiDung.findOne({ email });

        if (!nguoiDung || !(await nguoiDung.comparePassword(password))) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        const token = jwt.sign(
            { id: nguoiDung._id, role: nguoiDung.role },
            process.env.JWT_SECRET || "chuoi_ky_tu_bi_mat_bat_ky",
            { expiresIn: "1d" },
        );

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: token,
            user: { 
                id: nguoiDung._id, 
                username: nguoiDung.username, 
                email: nguoiDung.email, 
                role: nguoiDung.role 
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập", error: error.message });
    }
};

// 3. [POST] Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        const nguoiDung = await NguoiDung.findOne({ email: req.body.email });
        if (!nguoiDung) return res.status(404).json({ message: "Email không tồn tại!" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        nguoiDung.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        nguoiDung.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 

        await nguoiDung.save({ validateBeforeSave: false });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const resetUrl = `${frontendUrl}/dat-lai-mat-khau/${resetToken}`;
        
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
            email: nguoiDung.email,
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
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const nguoiDung = await NguoiDung.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!nguoiDung) {
            return res.status(400).json({ message: "Link khôi phục không hợp lệ hoặc đã hết hạn!" });
        }

        nguoiDung.password = req.body.password;
        nguoiDung.resetPasswordToken = undefined;
        nguoiDung.resetPasswordExpires = undefined;
        await nguoiDung.save();

        res.status(200).json({ message: "Mật khẩu của bạn đã được cập nhật thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu" });
    }
};