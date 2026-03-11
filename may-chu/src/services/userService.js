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

module.exports = {
  dangKyUser,
  layTatCaUser,
};
