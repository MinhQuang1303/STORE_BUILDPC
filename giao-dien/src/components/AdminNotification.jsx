import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Bell, X } from 'lucide-react';

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine WebSocket URL correctly based on environment
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace(/\/api$/, ''); // Strip /api from the end
    
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
            const body = JSON.parse(message.body);
            
            const newNotification = {
              id: Date.now(),
              message: body.message || 'Có đơn hàng mới',
            };
            
            setNotifications(prev => [...prev, newNotification]);
            
            // Phát sự kiện để QuanLyOrder bắt và tự động load lại dữ liệu
            window.dispatchEvent(new Event('backend_new_order'));

            // Auto remove after 5 seconds
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
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
      debug: (str) => {
        console.log(str); // Enable debug logs to see what's happening
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-10 right-10 z-[9999] flex flex-col gap-4">
      {/* Khối test lỗi - Trạng thái kết nối */}
      {/* <div className={`text-xs px-3 py-1 rounded-full shadow-md font-medium text-center transition-all duration-300 ${isConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
        Trạng thái ngầm: {isConnected ? '🔴 Sẵn sàng nhận thông báo' : 'Vui lòng F5 lại...'}
      </div> */}
      
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className="bg-white border-l-8 border-blue-600 shadow-2xl rounded-lg p-6 flex items-center justify-between min-w-[450px] transform transition-all duration-500"
          style={{ animation: 'slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
        >
          <div className="flex items-center gap-5">
            <div className="bg-blue-100 p-3 rounded-full shadow-inner">
              <Bell className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <div>
              <p className="font-black text-blue-900 text-lg uppercase tracking-wider mb-1">CÓ ĐƠN ĐẶT HÀNG MỚI!</p>
              <p className="text-gray-600 font-medium text-base">{notification.message}</p>
            </div>
          </div>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          from { transform: translateY(-100%) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default AdminNotification;
