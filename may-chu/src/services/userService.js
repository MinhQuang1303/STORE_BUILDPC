const NguoiDung = require("../models/NguoiDung");

const dangKyNguoiDung = async (userData) => {
  const { username, email, password, role } = userData;

  const nguoiDungTonTai = await NguoiDung.findOne({
    $or: [{ username }, { email }],
  });

  if (nguoiDungTonTai) {
    throw new Error("Tên đăng nhập hoặc Email đã được sử dụng");
  }

  const nguoiDungMoi = new NguoiDung({
    username,
    email,
    password,
    role: role || "user",
  });

  await nguoiDungMoi.save();
  return nguoiDungMoi;
};

const layTatCaNguoiDung = async () => {
  return await NguoiDung.find().select("-password");
};

const capNhatThongTinNguoiDung = async (idNguoiDung, data) => {
  const { hoTen, gioiTinh, soDienThoai, email, ngaySinh, diaChi } = data;
  
  // Kiểm tra email nếu đổi sang email khác đã tồn tại
  if (email) {
    const emailDaTonTai = await NguoiDung.findOne({ email, _id: { $ne: idNguoiDung } });
    if (emailDaTonTai) {
      throw new Error("Email đã được sử dụng bởi tài khoản khác!");
    }
  }

  const nguoiDungCapNhat = await NguoiDung.findByIdAndUpdate(
    idNguoiDung,
    {
      $set: {
        ...(hoTen && { hoTen }),
        ...(gioiTinh !== undefined && { gioiTinh }),
        ...(soDienThoai !== undefined && { soDienThoai }),
        ...(email && { email }),
        ...(ngaySinh && { ngaySinh }),
        ...(diaChi !== undefined && { diaChi })
      }
    },
    { new: true, runValidators: true }
  ).select("-password -resetPasswordToken -resetPasswordExpires");

  if (!nguoiDungCapNhat) {
    throw new Error("Không tìm thấy người dùng");
  }

  return nguoiDungCapNhat;
};

module.exports = {
  dangKyNguoiDung,
  layTatCaNguoiDung,
  capNhatThongTinNguoiDung,
};
