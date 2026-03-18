import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuenMatKhau = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Gọi API gửi email quên mật khẩu ở đây
    // Ví dụ: await authService.forgotPassword(email);
    
    // Giả lập delay gọi API
    setTimeout(() => {
      setMessage('Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Quên Mật Khẩu</h2>
        
        {message ? (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {message}
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-600">
            Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi cho bạn một đường dẫn để đặt lại mật khẩu.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email của bạn</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="nhap-email@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
              isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/dang-nhap" className="text-sm text-blue-600 hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuenMatKhau;