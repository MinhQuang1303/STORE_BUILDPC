import React, { useState } from 'react';

const DangKyKhuyenMai = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Gọi API lưu email đăng ký nhận khuyến mãi
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Đăng ký nhận mã giảm giá & deal sốc!
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-300">
          Nhận ngay voucher giảm 50K cho đơn hàng Build PC đầu tiên khi đăng ký bản tin của chúng tôi.
        </p>
        
        {subscribed ? (
          <p className="mt-6 text-xl text-green-400 font-semibold">
            Cảm ơn bạn! Bạn đã đăng ký nhận khuyến mãi thành công. 🎉
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-8 sm:flex justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 placeholder-gray-500 border border-transparent rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white sm:max-w-xs"
              placeholder="Nhập email của bạn"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DangKyKhuyenMai;