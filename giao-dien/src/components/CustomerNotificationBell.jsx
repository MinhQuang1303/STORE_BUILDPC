import React, { useState, useEffect } from "react";
import { Bell, ShoppingCart, MessageCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const CustomerNotificationBell = ({ user, unreadChatCount }) => {
    const [sysNotifs, setSysNotifs] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const fetchNotifications = () => {
        const uId = user?._id || user?.id;
        if (!uId) return;
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        axios.get(`${apiUrl}/notifications/customer/${uId}`)
            .then(res => {
                if (res.data.success) {
                    setSysNotifs(res.data.notifications);
                }
            })
            .catch(err => console.log("Lỗi fetch notification:", err));
    };

    useEffect(() => {
        fetchNotifications();
        
        const socketBase = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace("/api", "");
        const socket = io(socketBase);
        const uId = user?._id || user?.id;
        
        if (uId) {
            socket.on("connect", () => {
                socket.emit("join_room", uId.toString());
            });

            socket.on("order_status_update", (data) => {
                fetchNotifications();
                toast.success(data.message || "Đơn hàng của bạn đã được cập nhật!", {
                    icon: '📦',
                    style: {
                        borderRadius: '10px',
                        background: '#1e293b',
                        color: '#fff',
                    }
                });
            });
        }
        
        return () => socket.disconnect();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#customer-bell-container')) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id, isAlreadyRead) => {
        if (!isAlreadyRead) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                await axios.put(`${apiUrl}/notifications/${id}/read`);
                fetchNotifications();
            } catch (error) {
                console.error("Lỗi đánh dấu đã đọc:", error);
            }
        }
    };

    const handleOpenChat = () => {
        setIsNotificationOpen(false);
        const chatBtn = document.getElementById("chat-widget-trigger");
        if(chatBtn) chatBtn.click();
    };

    const sysUnread = sysNotifs.filter(n => !n.isRead).length;
    const totalUnread = unreadChatCount + sysUnread;

    return (
        <div id="customer-bell-container" className="relative group z-50">
            <div 
                className="relative p-2 hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
                <Bell size={24} className={totalUnread > 0 ? "animate-wiggle text-white" : "text-white"} />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a] animate-pulse text-white">
                        {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                )}
            </div>

            {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-gray-800 text-sm">Hộp thư thông báo</h3>
                        {totalUnread > 0 && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{totalUnread} mới</span>
                        )}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-50">
                        
                        {sysNotifs.map(notif => (
                            <div 
                                key={notif._id}
                                className={`p-4 transition flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-blue-50/20' : 'opacity-60 bg-white'}`}
                                onClick={() => markAsRead(notif._id, notif.isRead)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <ShoppingCart size={18} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`text-sm truncate ${!notif.isRead ? 'font-bold text-slate-800' : 'text-gray-600'}`}>{notif.title}</h4>
                                        {!notif.isRead && <CheckCircle size={14} className="text-gray-300 hover:text-blue-500" onClick={(e) => {e.stopPropagation(); markAsRead(notif._id, false)}} />}
                                    </div>
                                    <p className={`text-xs leading-tight ${!notif.isRead ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {notif.content}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}

                        <div 
                            onClick={handleOpenChat}
                            className={`p-4 cursor-pointer transition flex items-start gap-3 ${unreadChatCount > 0 ? 'bg-blue-50/20 hover:bg-blue-50/50' : 'bg-white hover:bg-gray-50 opacity-60'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${unreadChatCount > 0 ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 text-gray-400'}`}>
                                <MessageCircle size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={`text-sm truncate ${unreadChatCount > 0 ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>Hỗ trợ trực tuyến</h4>
                                    {unreadChatCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{unreadChatCount}</span>
                                    )}
                                </div>
                                <p className={`text-xs truncate mb-1 ${unreadChatCount > 0 ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {unreadChatCount > 0 ? (
                                        <>Bạn có <span className="font-bold text-red-500">{unreadChatCount}</span> tin nhắn mới</>
                                    ) : (
                                        "Mở kênh chat để tương tác với Admin"
                                    )}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate italic">
                                    Nhấn để mở khung chat
                                </p>
                            </div>
                        </div>

                        {(sysNotifs.length === 0 && unreadChatCount === 0) && (
                            <div className="p-8 text-center text-gray-400 text-sm italic">
                                ☕ Mọi thứ đang yên bình!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerNotificationBell;
