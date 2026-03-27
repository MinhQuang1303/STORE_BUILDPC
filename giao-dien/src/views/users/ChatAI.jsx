import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText, Send } from "lucide-react";

import { sendChat } from "../../services/chatService";

const ChatAI = () => {
  const navigate = useNavigate();

  const initialQuickPrompts = useMemo(
    () => ["Giá CPU i5 bao nhiêu?", "Mã giảm giá hiện tại?", "Tình trạng đơn hàng của tôi"],
    [],
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Chào bạn! Mình có thể trả lời dựa trên dữ liệu cửa hàng: giá linh kiện, mã giảm giá, và trạng thái đơn (khi bạn đăng nhập). Bạn muốn hỏi gì?",
    },
  ]);
  const [quickPrompts, setQuickPrompts] = useState(initialQuickPrompts);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set quick prompts lần đầu
    setQuickPrompts(initialQuickPrompts);
  }, [initialQuickPrompts]);

  const scrollToBottom = () => {
    const el = document.getElementById("chat-scroll");
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (rawText) => {
    const text = String(rawText ?? input).trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await sendChat(text);
      const data = res?.data || {};

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Mình không thể trả lời lúc này.",
          products: data.products || null,
          vouchers: data.vouchers || null,
          order: data.order || null,
        },
      ]);

      setQuickPrompts(data.quickPrompts || initialQuickPrompts);
    } catch (err) {
      const serverReply = err?.response?.data?.reply;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: serverReply || "Có lỗi khi gửi chat. Bạn thử lại nhé.",
        },
      ]);
      setQuickPrompts(initialQuickPrompts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <MessageSquareText size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Chat AI</h1>
            <p className="text-sm text-slate-500">Trả lời theo dữ liệu hiện có của STORE_BUILDPC</p>
          </div>
        </div>

        <div
          id="chat-scroll"
          className="flex-1 overflow-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm"
          style={{ maxHeight: "60vh" }}
        >
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] bg-blue-600 text-white rounded-2xl px-4 py-3"
                      : "max-w-[80%] bg-slate-50 text-slate-900 rounded-2xl px-4 py-3 border border-slate-200"
                  }
                >
                  <div className="whitespace-pre-wrap text-sm sm:text-base">{m.text}</div>

                  {m.products?.length ? (
                    <div className="mt-3 space-y-2">
                      {m.products.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => p?.sanPhamId && navigate(`/san-pham/${p.sanPhamId}`)}
                          className="w-full text-left flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-3 py-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                          type="button"
                        >
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500 truncate">
                              {p.bienTheTen ? `Biến thể: ${p.bienTheTen}` : "Sản phẩm"}
                            </div>
                            <div className="text-sm font-bold text-slate-900 truncate">{p.sanPhamTen}</div>
                          </div>
                          <div className="text-sm font-extrabold text-blue-600 whitespace-nowrap">
                            {Number(p.gia || 0).toLocaleString()} đ
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-slate-50 text-slate-900 rounded-2xl px-4 py-3 border border-slate-200">
                  Đang trả lời...
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold transition-colors"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập câu hỏi... (ví dụ: Giá CPU i5 bao nhiêu?)"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:bg-slate-300 disabled:hover:bg-slate-300 transition-colors"
              aria-label="Gửi"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Lưu ý: Trạng thái đơn hàng cần đăng nhập (token) để bảo mật.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;

