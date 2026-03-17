import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Banner = () => {
    const banners = [
        { 
            id: 1, 
            img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070", // Thay bằng link ảnh thật của bạn
            title: "SIÊU SALE RTX 4090", 
            sub: "Sức mạnh tối thượng - Giảm ngay 2 triệu đồng" 
        },
        { 
            id: 2, 
            img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957", 
            title: "BUILD PC GAMING", 
            sub: "Tặng kèm tản nhiệt nước AIO lấp lánh" 
        },
    ];

    return (
        <div style={{ width: '100%', height: '450px', marginBottom: '30px' }}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={true}
                pagination={{ clickable: true }}
                style={{ width: '100%', height: '100%', borderRadius: '15px' }}
            >
                {banners.map(b => (
                    <SwiperSlide key={b.id}>
                        <div style={{ 
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), transparent), url(${b.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '0 80px',
                            color: 'white'
                        }}>
                            <h1 style={{ fontSize: '45px', fontWeight: 'bold', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                                {b.title}
                            </h1>
                            <p style={{ fontSize: '22px', marginBottom: '20px', color: '#ccc' }}>
                                {b.sub}
                            </p>
                            <button style={{ 
                                width: '180px', 
                                padding: '15px', 
                                backgroundColor: '#6366f1', 
                                border: 'none', 
                                color: 'white', 
                                borderRadius: '8px', 
                                fontWeight: 'bold', 
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}>
                                MUA NGAY 🚀
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;