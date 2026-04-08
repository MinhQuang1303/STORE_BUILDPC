const User = require("../models/User");

const dangKyUser = async (userData) => {
  const { username, email, password, role } = userData;

  const userTonTai = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userTonTai) {
    throw new Error("Username hoặc Email đã được sử dụng");
  }

  const userMoi = new User({
    username,
    email,
    password,
    role: role || "user",
  });

  await userMoi.save();
  return userMoi;
};

const layTatCaUser = async () => {
  return await User.find().select("-password");
};

const capNhatThongTinUser = async (userId, data) => {
  const { hoTen, gioiTinh, soDienThoai, email, ngaySinh, diaChi } = data;
  
  // Kiểm tra email nếu đổi sang email khác đã tồn tại
  if (email) {
    const userDaTonTaiEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (userDaTonTaiEmail) {
      throw new Error("Email đã được sử dụng bởi tài khoản khác!");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
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

  if (!updatedUser) {
    throw new Error("Không tìm thấy người dùng");
  }

  return updatedUser;
};

module.exports = {
  dangKyUser,
  layTatCaUser,
  capNhatThongTinUser,
};
