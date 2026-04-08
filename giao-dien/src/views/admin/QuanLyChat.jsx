import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, User, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace("/api", "");

const QuanLyChat = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    // Tự động mở session nếu được truyền từ thông báo
    useEffect(() => {
        if (location.state?.openSession) {
            setActiveSession(location.state.openSession);
        }
    }, [location.state]);

    // Lấy danh sách session
    const fetchSessions = () => {
        axios.get(`${API_URL}/chat/sessions`)
            .then(res => {
                if (res.data.success) {
                    setSessions(res.data.sessions);
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchSessions();

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("admin_join");
        });

        // Khi có tin nhắn mới từ bất kỳ user nào gửi đến "admin_room"
        newSocket.on("SOCKET_EVENT_CHAT", (message) => {
            // Cập nhật session list
            fetchSessions();
            
            // Nếu tin đang mở đúng session đó thì cập nhật giao diện
            setActiveSession(prevActive => {
                if (prevActive && prevActive === message.sessionId) {
                    setMessages(prev => {
                        // Tránh lặp tin nhắn nếu socket fire nhiều lần
                        if (prev.some(m => m._id === message._id)) return prev;
                        return [...prev, message];
                    });
                }
                return prevActive;
            });
        });

        return () => newSocket.disconnect();
    }, []);

    // Load tin nhắn khi chọn một session
    useEffect(() => {
        // Lưu lại cho AdminLayout biết để tránh gắn toast trùng lặp
        window.currentChatSession = activeSession;
        
        if (activeSession) {
            axios.get(`${API_URL}/chat/${activeSession}`)
                .then(res => {
                    if (res.data.success) {
                        setMessages(res.data.messages);
                        // Đánh dấu đã đọc
                        axios.put(`${API_URL}/chat/read/admin/${activeSession}`).then(() => {
                            fetchSessions(); // Cập nhật lại unreadCount
                        });
                    }
                })
                .catch(err => console.log(err));
        }
    }, [activeSession]);

    // Cuộn xuống khi có tin mới
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket || !activeSession) return;

        const data = {
            sessionId: activeSession,
            sender: "admin",
            content: inputValue,
            userId: null,
            username: "Admin"
        };

        socket.emit("send_message", data);
        setInputValue("");
        
        // Cập nhật lastMessage ở sidebar liền
        fetchSessions();
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden m-6">
            {/* Sidebar danh sách user */}
            <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <MessageSquare className="text-blue-600" />
                    <h2 className="font-bold text-lg text-slate-800">Danh sách Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">Chưa có cuộc trò chuyện nào</div>
                    ) : (
                        sessions.map((session) => (
                            <div 
                                key={session._id} 
                                onClick={() => setActiveSession(session._id)}
                                className={`p-4 border-b border-slate-50 cursor-pointer flex items-start gap-4 transition
                                    ${activeSession === session._id ? "bg-blue-50 border-blue-100" : "hover:bg-slate-50"}
                                `}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600">
                                        <User size={18} />
                                    </div>
                                    {session.unreadCount > 0 && activeSession !== session._id && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                                            {session.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-slate-800 truncate">{session.username || "Khách hàng"}</h4>
                                        <span className="text-xs text-slate-400">
                                            {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${session.unreadCount > 0 && activeSession !== session._id ? "text-slate-800 font-bold" : "text-slate-500"}`}>
                                        {session.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Khung chat bên phải */}
            <div className="flex-1 flex flex-col bg-slate-50">
                {activeSession ? (
                    <>
                        {/* Header Chat */}
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-blue-600">
                                <User size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">
                                    {sessions.find(s => s._id === activeSession)?.username || "Khách hàng"}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono">{activeSession}</p>
                            </div>
                        </div>

                        {/* Nội dung chat */}
                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                            {messages.map((msg, index) => {
                                const isAdmin = msg.sender === "admin";
                                return (
                                    <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isAdmin ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Ô nhập */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Nhập câu trả lời cho khách hàng (Nhấn Enter để gửi)..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare size={48} className="mb-4 opacity-50" />
                        <p>Chọn một cuộc hội thoại để bắt đầu</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuanLyChat;
