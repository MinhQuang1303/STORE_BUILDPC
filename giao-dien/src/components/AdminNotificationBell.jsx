import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Bell, ShoppingCart, MessageCircle, CheckCircle } from 'lucide-react';

const AdminNotificationBell = ({ iconClassName = "text-slate-600" }) => {
    const navigate = useNavigate();
    const [unreadSessions, setUnreadSessions] = useState([]);
    const [sysNotifs, setSysNotifs] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const fetchAllData = () => {
        // Fetch Chat
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        axios.get(`${apiUrl}/chat/sessions`)
            .then(res => {
                if (res.data.success) {
                    setUnreadSessions(res.data.sessions); // Remove filter to keep read chats
                }
            })
            .catch(err => console.log(err));

        // Fetch Notifications
        axios.get(`${apiUrl}/notifications/admin`)
            .then(res => {
                if (res.data.success) {
                    // Lưu toàn bộ, không filter loại đã xem
                    setSysNotifs(res.data.notifications);
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchAllData();
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const socketBase = apiUrl.replace("/api", "");
        const socket = io(socketBase);

        socket.on("connect", () => {
            socket.emit("admin_join");
        });

        // 1. NGHE TIN NHẮN CHAT
        socket.on("SOCKET_EVENT_CHAT", (message) => {
            fetchAllData(); 
            // KHÓA CỨNG: Chỉ hiện Toast nếu đúng là dữ liệu Tin nhắn
            if (message && message.content && message.sender === "customer") {
                if (window.currentChatSession !== message.sessionId) {
                    toast(`Bạn có tin nhắn từ: ${message.username || "Khách"}`, {
                        id: `chat-msg-${message._id}`,
                        icon: '💬',
                        style: { borderRadius: '10px', background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe' },
                    });
                }
            }
        });

        // 2. NGHE ĐƠN HÀNG MỚI
        socket.on("SOCKET_EVENT_ORDER", (data) => {
            fetchAllData(); 
            // KHÓA CỨNG: Chỉ hiện Toast nếu đúng là dữ liệu Đơn hàng
            if (data && (data.order || data.notification?.type === 'order')) {
                const orderId = data.order?._id || data.notification?.linkData || "new";
                toast(`Có ĐƠN HÀNG MỚI vừa nổ! 🚀`, {
                    id: `order-toast-${orderId}`,
                    icon: '🛒',
                    style: { borderRadius: '10px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 'bold' },
                });
            }
        });

        return () => {
            socket.off("SOCKET_EVENT_CHAT");
            socket.off("SOCKET_EVENT_ORDER");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#admin-bell-container')) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (notifId, isAlreadyRead, linkData) => {
        try {
            if (!isAlreadyRead) {
                const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
                await axios.put(`${apiUrl}/notifications/${notifId}/read`);
                fetchAllData(); // Refresh list
            }
            setIsNotificationOpen(false);
            navigate('/admin/orders'); // Điều hướng tới bảng Orders
        } catch (error) {
            console.error("Lỗi markAsRead", error);
        }
    };

    const chatTotal = unreadSessions.reduce((acc, s) => acc + s.unreadCount, 0);
    const sysUnreadCount = sysNotifs.filter(n => !n.isRead).length;
    const totalUnread = chatTotal + sysUnreadCount;

    return (
        <div id="admin-bell-container" className="relative z-50">
            <div 
                className="relative cursor-pointer hover:bg-gray-100/10 p-2 rounded-full transition"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
                <Bell size={24} className={iconClassName} />
                {totalUnread > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex justify-center items-center text-[9px] font-bold text-white border-2 border-transparent">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                )}
            </div>

            {/* MESSAGE DROPDOWN */}
            {isNotificationOpen && (
                <div className="absolute top-full right-0 lg:right-1/2 lg:translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-gray-800 text-sm">Hộp thư hệ thống</h3>
                        {totalUnread > 0 && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{totalUnread} mới</span>}
                    </div>
                    
                    <div className="max-h-[450px] overflow-y-auto">
                        
                        {/* --- PHẦN 1: ĐƠN HÀNG (Dạng system notifs) --- */}
                        <div className="px-4 py-2 bg-slate-100/80 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center sticky top-0 z-10 backdrop-blur-md border-y border-gray-100">
                            <span>📦 ĐƠN HÀNG MỚI ({sysUnreadCount})</span>
                        </div>
                        <div className="divide-y divide-gray-50 mb-2">
                            {sysNotifs.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-400 italic">Chưa có thông báo đơn hàng</div>
                            ) : (
                                sysNotifs.map(notif => (
                                    <div 
                                        key={notif._id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition flex items-start gap-3 ${!notif.isRead ? 'bg-green-50/30' : 'opacity-60 bg-white'}`}
                                        onClick={() => markAsRead(notif._id, notif.isRead, notif.linkData)}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <ShoppingCart size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className={`text-sm truncate ${!notif.isRead ? 'font-bold text-green-800' : 'font-medium text-gray-600'}`}>{notif.title}</h4>
                                                {!notif.isRead && (
                                                    <div onClick={(e) => { e.stopPropagation(); markAsRead(notif._id, false); }} className="text-gray-300 hover:text-green-600" title="Đánh dấu đã đọc">
                                                        <CheckCircle size={14}/>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-xs leading-tight ${!notif.isRead ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {notif.content}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* --- PHẦN 2: TIN NHẮN CHAT --- */}
                        <div className="px-4 py-2 bg-slate-100/80 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center sticky top-0 z-10 backdrop-blur-md border-y border-gray-100 mt-1">
                            <span>💬 TIN NHẮN CHAT ({chatTotal})</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {unreadSessions.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-400 italic">Hộp thư chat trống</div>
                            ) : (
                                unreadSessions.map(session => (
                                    <div 
                                        key={session._id}
                                        onClick={() => {
                                            setIsNotificationOpen(false);
                                            navigate("/admin/chat", { state: { openSession: session._id } });
                                        }}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition flex items-start gap-3 ${session.unreadCount > 0 ? 'bg-blue-50/30' : 'opacity-60 bg-white'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${session.unreadCount > 0 ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 text-gray-400'}`}>
                                            <MessageCircle size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className={`text-sm truncate ${session.unreadCount > 0 ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>{session.username || "Khách hàng"}</h4>
                                                {session.unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{session.unreadCount}</span>}
                                            </div>
                                            <p className={`text-[10px] truncate italic ${session.unreadCount > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                                                "{session.lastMessage}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationBell;
