// giao-dien/src/services/sanPhamService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/san-pham';

// Lấy token từ localStorage
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? { Authorization: `Bearer ${user.token}` } : {};
};

export const layTatCaSanPham = () => axios.get(API_URL);

export const themSanPhamMoi = (data) => 
    axios.post(API_URL, data, { headers: getAuthHeader() });

export const xoaSanPham = (id) => 
    axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });