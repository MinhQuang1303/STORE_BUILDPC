import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:5000";

const CustomerChatWidget = ({ user, unreadCount, setUnreadCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Thay vì dùng localStorage ngẫu nhiên, ta đồng bộ tuyệt đối đoạn chat bằng chính ID Khách hàng
    const sessionId = user._id || user.id;

    useEffect(() => {
        // Tải lịch sử chat
        axios.get(`${process.env.REACT_APP_API_URL}/chat/${sessionId}`)
            .then(res => {
                if (res.data.success) {
                    setMessages(res.data.messages);
                }
            })
            .catch(err => console.log(err));

        // Tải số lượng tin chưa đọc
        axios.get(`${process.env.REACT_APP_API_URL}/chat/unread/customer/${sessionId}`)
            .then(res => {
                if (res.data.success) {
                    setUnreadCount(res.data.unreadCount);
                }
            })
            .catch(err => console.log(err));

        // Kết nối socket
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("join_room", sessionId);
        });

        newSocket.on("receive_message", (message) => {
            setMessages(prev => {
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
            
            if (message.sender === "admin") {
                if (isOpen) {
                    // Nếu đang mở khung chat thì đánh dấu đã đọc luôn
                    axios.put(`${process.env.REACT_APP_API_URL}/chat/read/customer/${sessionId}`).catch(e => {});
                } else {
                    // Bật Toast nhắc nhở và tăng số
                    toast("Admin vừa nhắn tin cho bạn!", {
                        icon: '💬',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                    setUnreadCount(prev => prev + 1);
                }
            }
        });

        return () => newSocket.disconnect();
    }, [sessionId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
        
        // Khi mở popup lên thì clear badge và gọi API read
        if (isOpen && unreadCount > 0) {
            setUnreadCount(0);
            axios.put(`${process.env.REACT_APP_API_URL}/chat/read/customer/${sessionId}`).catch(e => {});
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket) return;

        const data = {
            sessionId: sessionId,
            sender: "customer",
            content: inputValue,
            userId: user._id || user.id,
            username: user.username || user.ten || "Khách"
        };

        socket.emit("send_message", data);
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Vòng tròn thu nhỏ */}
            {!isOpen && (
                <button 
                    id="chat-widget-trigger"
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-700 transition duration-300 relative group animate-bounce"
                >
                    <MessageCircle size={28} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold justify-center items-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                    <div className="absolute -top-10 right-0 bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-blue-100">
                        Chat với Admin
                    </div>
                </button>
            )}

            {/* Khung chat */}
            {isOpen && (
                <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" style={{ height: "450px" }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white flex justify-between items-center rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                                AD
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Hỗ trợ trực tuyến</h3>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-xs text-blue-100">Đang hoạt động</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                        <p className="text-xs text-center text-slate-400 mb-2 font-medium">Bắt đầu trò chuyện</p>
                        {messages.map((msg, index) => {
                            const isMine = msg.sender === "customer";
                            return (
                                <div key={index} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMine ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-800 justify-start rounded-tl-sm shadow-sm"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập tin nhắn..." 
                                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputValue.trim()}
                                className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-xl text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <Send size={18} className="ml-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerChatWidget;
