import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Bell, Package, X, CheckCheck } from 'lucide-react';

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  // Toast popups nổi (giống như cũ)
  const [toasts, setToasts] = useState([]);
  const dropdownRef = useRef(null);

  // Kết nối WebSocket
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace(/\/api$/, '');

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('STOMP Connected');
        setIsConnected(true);
        stompClient.subscribe('/topic/orders', (message) => {
          console.log('Received STOMP message:', message.body);
          if (message.body) {
            try {
              const body = JSON.parse(message.body);
              const newNotif = {
                id: Date.now(),
                message: body.message || 'Có đơn hàng mới',
                time: new Date(),
                read: false,
              };

              // Thêm vào danh sách chuông
              setNotifications(prev => [newNotif, ...prev].slice(0, 30));
              setUnreadCount(prev => prev + 1);

              // Hiện toast popup nổi (tự mất sau 5 giây)
              const toastId = Date.now() + Math.random();
              setToasts(prev => [...prev, { ...newNotif, toastId }]);
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.toastId !== toastId));
              }, 5000);

              // Phát sự kiện để QuanLyOrder tự động load lại dữ liệu
              window.dispatchEvent(new Event('backend_new_order'));
            } catch (e) {
              console.error('Error parsing notification', e);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        console.log('WebSocket Closed');
        setIsConnected(false);
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotif = (id) => {
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* ===== TOAST POPUP NỔI (giữ như cũ) ===== */}
      <div className="fixed top-10 right-10 z-[9999] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.toastId}
            className="bg-white border-l-8 border-blue-600 shadow-2xl rounded-lg p-6 flex items-center justify-between min-w-[450px] pointer-events-auto"
            style={{ animation: 'slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          >
            <div className="flex items-center gap-5">
              <div className="bg-blue-100 p-3 rounded-full shadow-inner">
                <Bell className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <div>
                <p className="font-black text-blue-900 text-lg uppercase tracking-wider mb-1">CÓ ĐƠN ĐẶT HÀNG MỚI!</p>
                <p className="text-gray-600 font-medium text-base">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.toastId !== toast.toastId))}
              className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      {/* ===== CHUÔNG DROPDOWN TRÊN HEADER ===== */}
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group"
          title="Thông báo đơn hàng"
        >
          <Bell
            size={22}
            className={`transition-colors ${isConnected ? 'text-slate-600 group-hover:text-blue-600' : 'text-slate-400'}`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white px-0.5 shadow">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-[9999] overflow-hidden"
            style={{ animation: 'dropIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-600" />
                <span className="font-bold text-slate-800">Hộp thư hệ thống</span>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <CheckCheck size={13} />
                  Đọc tất cả
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Package size={36} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">Chưa có thông báo đơn hàng</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group ${!notif.read ? 'bg-blue-50/60' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${!notif.read ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <Package size={16} className={!notif.read ? 'text-white' : 'text-slate-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                        🛒 {notif.message}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{formatTime(notif.time)}</p>
                    </div>
                    <button
                      onClick={() => removeNotif(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 text-slate-300 hover:text-red-500 transition-all flex-shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer status */}
            <div className={`px-5 py-2.5 flex items-center gap-1.5 text-[11px] border-t border-slate-100 ${isConnected ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {isConnected ? 'Đang lắng nghe đơn hàng mới...' : 'Mất kết nối – đang thử lại...'}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%) scale(0.9); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </>
  );
};

export default AdminNotification;
