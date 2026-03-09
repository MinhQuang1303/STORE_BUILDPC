import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// 1. Hàm Đăng Ký
export const dangKy = (userData) => {
    return axios.post(`${API_URL}/dang-ky`, userData);
};

// 2. Hàm Đăng Nhập
export const dangNhap = async (userData) => {
    const response = await axios.post(`${API_URL}/dang-nhap`, userData);
    
    // Nếu Backend trả về token thành công
    if (response.data.token) {
        // Lưu toàn bộ object gồm: { message, token, user: { id, ten, email, vaiTro } }
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// 3. Hàm lấy thông tin User hiện tại (Dùng để kiểm tra trạng thái login nhanh)
export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// 4. Hàm Đăng Xuất
export const dangXuat = () => {
    localStorage.removeItem('user');
    // Có thể dùng window.location.href để ép trang web load lại trạng thái sạch
    window.location.href = '/login';
};