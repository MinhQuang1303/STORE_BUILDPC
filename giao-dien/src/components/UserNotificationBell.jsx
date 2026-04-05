import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Bell, Package, X, CheckCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Map trạng thái → màu + icon
const STATUS_CONFIG = {
  Pending:   { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50',  dot: 'bg-yellow-400', emoji: '⏳' },
  Confirmed: { label: 'Đã xác nhận',  color: 'text-blue-600 bg-blue-50',      dot: 'bg-blue-500',   emoji: '✅' },
  Shipping:  { label: 'Đang giao',    color: 'text-orange-600 bg-orange-50',  dot: 'bg-orange-400', emoji: '🚚' },
  Delivered: { label: 'Đã giao',      color: 'text-green-600 bg-green-50',    dot: 'bg-green-500',  emoji: '📦' },
  Cancelled: { label: 'Đã hủy',       color: 'text-red-600 bg-red-50',        dot: 'bg-red-400',    emoji: '❌' },
};

const UserNotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // Toast popups
  const [toasts, setToasts] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Lấy userId an toàn từ nhiều dạng cấu trúc object
  const userId = user?._id || user?.id || null;

  useEffect(() => {
    if (!userId) {
      console.log('[UserNotificationBell] Chưa đăng nhập hoặc không tìm thấy userId:', user);
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace(/\/api$/, '');
    const topic = `/topic/order-status/${userId}`;
    console.log('[UserNotificationBell] Đang kết nối WebSocket, subscribe topic:', topic);

    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.log('[UserNotificationBell] Đã kết nối STOMP, subscribe:', topic);
        // Subscribe topic riêng theo userId
        client.subscribe(topic, (message) => {
          console.log('[UserNotificationBell] Nhận được message:', message.body);
          if (message.body) {
            try {
              const body = JSON.parse(message.body);
              const newNotif = {
                id: Date.now(),
                orderId: body.orderId,
                trangThai: body.trangThai,
                trangThaiLabel: body.trangThaiLabel,
                message: body.message,
                time: new Date(),
                read: false,
              };
              setNotifications(prev => [newNotif, ...prev].slice(0, 30));
              setUnreadCount(prev => prev + 1);

              // Hiện toast popup
              const toastId = Date.now() + Math.random();
              setToasts(prev => [...prev, { ...newNotif, toastId }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.toastId !== toastId));
              }, 5000);
            } catch (e) {
              console.error('Error parsing user notification', e);
            }
          }
        });
      },
      onWebSocketClose: () => {
        console.log('[UserNotificationBell] WebSocket đóng kết nối');
        setIsConnected(false);
      },
    });

    client.activate();
    return () => {
      console.log('[UserNotificationBell] Cleanup: deactivate client');
      client.deactivate();
    };
  }, [userId]); // Chỉ reconnect khi userId thay đổi (không phải toàn bộ user object)

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotif = (id, e) => {
    e.stopPropagation();
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) {
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setIsOpen(false);
    navigate('/don-hang-cua-toi');
  };

  if (!user) return null; // Không render nếu chưa đăng nhập
  if (!userId) {
    // user tồn tại nhưng không tìm thấy _id → log để debug
    console.warn('[UserNotificationBell] user object không có _id/id:', user);
  }

  return (
    <>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 hover:bg-slate-800 rounded-full transition-colors"
          title="Thông báo đơn hàng"
        >
          <Bell size={22} className={`transition-colors ${isConnected ? 'text-white' : 'text-slate-400'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[#0f172a] px-0.5 shadow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Toast ngay bên dưới chuông (chỉ hiện khi chưa mở dropdown) */}
        {toasts.length > 0 && !isOpen && (
          <div className="absolute right-0 mt-2 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => {
              const cfg = STATUS_CONFIG[toast.trangThai] || STATUS_CONFIG.Pending;
              return (
                <div
                  key={toast.toastId}
                  className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[300px] pointer-events-auto"
                  style={{ animation: 'dropIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cfg.color}`}>
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm">Cập nhật đơn hàng</p>
                      <p className="text-slate-600 text-xs mt-0.5 leading-snug">{toast.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/don-hang-cua-toi')}
                    className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Xem đơn hàng →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-[370px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-[9999] overflow-hidden text-slate-900"
            style={{ animation: 'dropIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Thông báo của tôi</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <CheckCheck size={13} /> Đọc tất cả
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <Package size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Chưa có cập nhật đơn hàng nào</p>
                </div>
              ) : (
                notifications.map(notif => {
                  const cfg = STATUS_CONFIG[notif.trangThai] || STATUS_CONFIG.Pending;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors group ${!notif.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base ${cfg.color}`}>
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                        </div>
                        <p className={`text-xs leading-snug ${!notif.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(notif.time)}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) => removeNotif(notif.id, e)}
                          className="p-1 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => { setIsOpen(false); navigate('/don-hang-cua-toi'); }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Xem tất cả đơn hàng →
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </>
  );
};

export default UserNotificationBell;
