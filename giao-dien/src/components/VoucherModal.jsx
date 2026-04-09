import React from 'react';
import { Ticket, X, Clock, Zap } from 'lucide-react';

const VoucherModal = ({ vouchers, isOpen, onClose, onApply }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-[500px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Ticket size={100} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter uppercase">
                            <Ticket className="text-indigo-400" size={24} />
                            Kho Voucher Của Bạn
                        </h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tiết kiệm nhiều hơn cho đơn hàng của bạn</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar">
                    {(!vouchers || vouchers.length === 0) ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border-4 border-white shadow-inner">
                                <Ticket size={40} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Hiện chưa có mã nào khả dụng</p>
                        </div>
                    ) : (
                        vouchers.map(v => (
                            <div 
                                key={v._id} 
                                className="group flex bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-100 relative"
                            >
                                {/* Left part - Coupon look */}
                                <div className={`w-24 pb-4 flex flex-col items-center justify-center text-white relative ${v.trangThai ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-slate-300'}`}>
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                        {[...Array(6)].map((_, i) => <div key={i} className="w-3 h-3 bg-slate-50 rounded-full"></div>)}
                                    </div>
                                    <span className="text-2xl font-black">{v.loaiGiamGia === 'phanTram' ? `${v.giaTri}%` : '🎁'}</span>
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">GIẢM GIÁ</span>
                                    
                                    <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-2">
                                        {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-[3px] bg-white/30 rounded-full"></div>)}
                                    </div>
                                </div>

                                {/* Right part - Info */}
                                <div className="flex-1 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <b className="text-slate-900 text-lg font-black tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{v.ma}</b>
                                            <p className="text-slate-500 text-xs font-medium mt-1 leading-tight">{v.moTa || `Giảm ${v.giaTri.toLocaleString()}${v.loaiGiamGia === 'phanTram' ? '%' : 'đ'}`}</p>
                                        </div>
                                        {v.loaiGiamGia !== 'phanTram' && (
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md">-{v.giaTri.toLocaleString()}đ</span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                <Clock size={10} />
                                                HẾT HẠN: {new Date(v.ngayHetHan).toLocaleDateString('vi-VN')}
                                            </div>
                                            {v.giaTriDonHangToiThieu > 0 && (
                                                <div className="text-[10px] text-amber-500 font-bold uppercase mt-0.5">
                                                    ĐƠN TỪ {v.giaTriDonHangToiThieu.toLocaleString()}đ
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => { onApply(v.ma); onClose(); }}
                                            disabled={!v.trangThai}
                                            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                                                v.trangThai 
                                                ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200' 
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Áp Dụng
                                        </button>
                                    </div>
                                </div>
                                
                                {v.soLuong > 0 && v.daSuDung >= v.soLuong && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                        <span className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full transform -rotate-12 shadow-xl border-2 border-white uppercase tracking-widest">Đã Hết Lượt</span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Tip */}
                <div className="bg-white p-6 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1.5 uppercase">
                        <Zap size={12} className="text-amber-400" />
                        Mỗi đơn hàng chỉ áp dụng được duy nhất 01 mã giảm giá
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;