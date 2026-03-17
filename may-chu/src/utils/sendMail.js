const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Tạo transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Sử dụng service 'gmail' cho nhanh và ổn định
    auth: {
      user: process.env.EMAIL_USER, // Tên biến trong file .env
      pass: process.env.EMAIL_PASS, // Tên biến trong file .env
    },
  });

  // 2. Định nghĩa các tuỳ chọn của email
  const mailOptions = {
    from: `"STORE BUILDPC" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, 
  };

  // 3. Thực hiện gửi mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email đã được gửi thành công đến: " + options.email);
  } catch (error) {
    console.error("❌ Lỗi Nodemailer: ", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

module.exports = sendEmail;