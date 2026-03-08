import axios from 'axios';

const API_URL = 'http://localhost:5000/api/san-pham';

export const laySanPhamTheoLoai = async (loai) => {
    try {
        // Nếu có loại thì gọi ?loai=CPU, không thì lấy hết
        const url = loai ? `${API_URL}?loai=${loai}` : API_URL;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        return [];
    }
};