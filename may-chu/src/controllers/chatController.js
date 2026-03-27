const jwt = require("jsonwebtoken");

const SanPham = require("../models/SanPham");
const BienThe = require("../models/BienThe");
const Order = require("../models/Order");
const MaGiamGia = require("../models/MaGiamGia");

const { kiemTraMaGiamGia } = require("../services/maGiamGiaService");

const JWT_SECRET_FALLBACK = "chuoi_ky_tu_bi_mat_bat_ky";

function getDecodedUserFromAuthHeader(req) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return null;

  try {
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET_FALLBACK);
  } catch {
    return null;
  }
}

function extractOrderId(text) {
  // MongoDB ObjectId: 24 hex chars
  const match = text.match(/\b[a-fA-F0-9]{24}\b/);
  return match?.[0] || null;
}

function extractOrderSuffix(text) {
  // UI đang hiển thị mã đơn rút gọn 8 ký tự cuối
  // Ưu tiên bắt theo cụm "mã đơn" / "#" rồi mới fallback bắt 8 hex cuối.
  const preferred = text.match(
    /(?:mã\s*đơn|ma\s*don|đơn\s*hàng|don\s*hang|#)\s*[:\-]?\s*([a-fA-F0-9]{8})/i,
  );
  return preferred?.[1] || null;
}

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchRegex(text) {
  const rawTerms = text
    .toLowerCase()
    .split(/[^a-zA-Z0-9À-ỹ\-]+/g)
    .map((t) => t.trim())
    .filter((t) => (t.length >= 3) || (t.length >= 2 && /\d/.test(t)));

  // Chỉ lấy một số "cụm" để regex không quá dài
  const terms = rawTerms.slice(0, 6);
  if (terms.length === 0) return null;

  const pattern = terms.map(escapeRegExp).join("|");
  return new RegExp(pattern, "i");
}

async function getActiveVouchers() {
  const now = new Date();
  const all = await MaGiamGia.find({ trangThai: true }).limit(50);

  const active = all.filter((v) => {
    const startOk = v.ngayBatDau && v.ngayBatDau <= now;
    const endOk = v.ngayHetHan && v.ngayHetHan >= now;
    const qtyOk = typeof v.soLuong === "number" ? v.soLuong === 0 || v.daSuDung < v.soLuong : true;
    return startOk && endOk && qtyOk;
  });

  // Ưu tiên cái mới sắp bắt đầu / sắp hết hạn
  return active.sort((a, b) => b.ngayBatDau - a.ngayBatDau).slice(0, 5);
}

async function searchProducts(text) {
  const regex = buildSearchRegex(text);

  if (!regex) {
    return {
      products: [],
    };
  }

  // Ưu tiên tìm theo biến thể vì biến thể chứa đúng "tên linh kiện" và "giá"
  const variants = await BienThe.find({ ten: regex })
    .limit(8)
    .populate({ path: "idSanPham", select: "ten gia anh idDanhMuc" });

  if (variants?.length) {
    const products = variants.map((bt) => ({
      sanPhamId: bt.idSanPham?._id,
      sanPhamTen: bt.idSanPham?.ten,
      bienTheTen: bt.ten,
      gia: bt.gia,
    }));

    return { products };
  }

  const sanPhams = await SanPham.find({ ten: regex })
    .limit(8)
    .select("ten gia anh idDanhMuc")
    .populate("idDanhMuc");

  return {
    products: sanPhams.map((sp) => ({
      sanPhamId: sp._id,
      sanPhamTen: sp.ten,
      bienTheTen: null,
      gia: sp.gia,
      loaiDanhMuc: sp.idDanhMuc?.ten || null,
    })),
  };
}

function looksLikeVoucherRequest(text) {
  const t = text.toLowerCase();
  const keys = [
    "mã giảm giá",
    "ma giam gia",
    "khuyến mãi",
    "giam gia",
    "giảm giá",
    "voucher",
    "coupon",
  ];
  return keys.some((k) => t.includes(k));
}

function extractVoucherCode(text) {
  // Lấy một chuỗi "mã" kiểu ABC123 (cố gắng không bắt quá dài)
  const match = text.match(/\b[A-Za-z0-9]{4,}\b/);
  return match?.[0] || null;
}

function looksLikeOrderStatusRequest(text) {
  const t = text.toLowerCase();
  return (
    t.includes("trạng thái") ||
    t.includes("tình trạng") ||
    t.includes("đơn hàng") ||
    (t.includes("đơn") && (t.includes("của") || t.includes("tôi")))
  );
}

exports.trangPhucChat = async (req, res) => {
  try {
    const { message } = req.body || {};
    const text = String(message || "").trim();

    if (!text) {
      return res.status(400).json({
        reply: "Bạn hãy nhập câu hỏi (ví dụ: 'Giá CPU i5 bao nhiêu?', 'Mã giảm giá hiện tại?', 'Tình trạng đơn hàng của tôi ...').",
        quickPrompts: [
          "Giá CPU i5 bao nhiêu?",
          "Mã giảm giá hiện tại?",
          "Tình trạng đơn hàng của tôi",
        ],
      });
    }

    const t = text.toLowerCase();

    // 1) Mã giảm giá / khuyến mãi
    if (looksLikeVoucherRequest(text)) {
      const code = extractVoucherCode(text);

      if (code) {
        try {
          const voucher = await kiemTraMaGiamGia(code);
          return res.json({
            reply: `Mã giảm giá ${voucher.ma} đang hợp lệ.\n- Loại: ${voucher.loaiGiamGia}\n- Giá trị: ${voucher.giaTri}${
              voucher.loaiGiamGia === "phanTram" ? "%" : ""
            }\n- Từ ${new Date(voucher.ngayBatDau).toLocaleDateString()} đến ${new Date(
              voucher.ngayHetHan,
            ).toLocaleDateString()}\n- Số lượng còn: ${
              voucher.soLuong === 0 ? "Vô hạn" : Math.max(voucher.soLuong - voucher.daSuDung, 0)
            }`,
            quickPrompts: ["Tìm linh kiện theo giá", "Giá VGA RTX bao nhiêu?"],
          });
        } catch (e) {
          return res.json({
            reply: `Mình chưa xác nhận được mã giảm giá bạn nhập (${code}). Bạn có thể cho mình thử mã khác hoặc hỏi “mã giảm giá hiện tại”.`,
            quickPrompts: ["Mã giảm giá hiện tại?", "Giá SSD NVMe 1TB bao nhiêu?"],
          });
        }
      }

      const active = await getActiveVouchers();

      if (!active.length) {
        return res.json({
          reply: "Hiện chưa có mã giảm giá nào đang hoạt động.",
          quickPrompts: ["Giá CPU i5 bao nhiêu?", "Tìm SSD NVMe giá tốt"],
        });
      }

      return res.json({
        reply:
          "Đây là một số mã giảm giá đang hoạt động:\n" +
          active
            .map((v) => {
              const value =
                v.loaiGiamGia === "phanTram"
                  ? `${v.giaTri}%`
                  : `${v.giaTri}đ`;
              return `- ${v.ma}: ${value} (từ ${new Date(v.ngayBatDau).toLocaleDateString()} đến ${new Date(
                v.ngayHetHan,
              ).toLocaleDateString()})`;
            })
            .join("\n"),
        vouchers: active.map((v) => ({
          ma: v.ma,
          loaiGiamGia: v.loaiGiamGia,
          giaTri: v.giaTri,
          ngayBatDau: v.ngayBatDau,
          ngayHetHan: v.ngayHetHan,
        })),
        quickPrompts: ["Giá VGA RTX bao nhiêu?", "Tình trạng đơn hàng của tôi"],
      });
    }

    // 2) Trạng thái đơn hàng (cần đăng nhập để biết đúng đơn của bạn)
    if (looksLikeOrderStatusRequest(text) || extractOrderId(text)) {
      const decoded = getDecodedUserFromAuthHeader(req);
      const orderId = extractOrderId(text);
      const orderSuffix = !orderId ? extractOrderSuffix(text) : null;

      if (!decoded?.id) {
        return res.json({
          reply: "Để xem trạng thái đơn hàng, bạn cần đăng nhập. (Bạn có thể đăng nhập rồi quay lại chat.)",
          quickPrompts: ["Mã giảm giá hiện tại?", "Giá RAM DDR5 bao nhiêu?"],
        });
      }

      if (!orderId && !orderSuffix) {
        return res.json({
          reply:
            "Bạn cho mình mã đơn để tra trạng thái nhé. Bạn có thể dán mã rút gọn (8 ký tự cuối) như trong trang “Đơn hàng của tôi”.",
          quickPrompts: ["Tình trạng đơn hàng của tôi", "Giá CPU i5 bao nhiêu?"],
        });
      }

      let order = null;
      if (orderId) {
        order = await Order.findOne({ _id: orderId, idUser: decoded.id }).populate({
          path: "orderItems",
          populate: [{ path: "idSanPham" }, { path: "idBienThe" }],
        });
      } else {
        // Match theo suffix 8 ký tự cuối
        const orders = await Order.find({ idUser: decoded.id })
          .sort({ createdAt: -1 })
          .limit(30)
          .populate({
            path: "orderItems",
            populate: [{ path: "idSanPham" }, { path: "idBienThe" }],
          });

        order = orders.find((o) => o?._id?.toString?.().slice(-8).toLowerCase() === String(orderSuffix).toLowerCase()) || null;
      }

      if (!order) {
        return res.json({
          reply: "Không tìm thấy đơn hàng đó (hoặc đơn không thuộc về tài khoản của bạn).",
          quickPrompts: ["Danh sách đơn hàng của tôi", "Giá SSD NVMe bao nhiêu?"],
        });
      }

      const items = (order.orderItems || []).map((it) => ({
        sanPhamTen: it.idSanPham?.ten || "Sản phẩm",
        bienTheTen: it.idBienThe?.ten || null,
        soLuong: it.soLuong,
        gia: it.gia,
      }));

      return res.json({
        reply:
          `Đơn hàng ${orderId} hiện tại: ${order.trangThai}. ` +
          `Thanh toán: ${order.trangThaiThanhToan}.` +
          `\nTổng tiền: ${Number(order.tongTien || 0).toLocaleString()} đ` +
          `\nChi tiết:\n` +
          items
            .slice(0, 8)
            .map((x) => {
              const line =
                `- ${x.sanPhamTen}` + (x.bienTheTen ? ` (${x.bienTheTen})` : "") + ` x${x.soLuong}: ${Number(x.gia).toLocaleString()} đ`;
              return line;
            })
            .join("\n"),
        order: {
          id: orderId,
          trangThai: order.trangThai,
          trangThaiThanhToan: order.trangThaiThanhToan,
          tongTien: order.tongTien,
          items,
        },
        quickPrompts: ["Giảm giá đang có mã gì?", "Giá CPU i5 bao nhiêu?"],
      });
    }

    // 3) Tư vấn theo dữ liệu sản phẩm (giá/linh kiện)
    const { products } = await searchProducts(text);

    if (products?.length) {
      const first = products.slice(0, 6);
      return res.json({
        reply:
          "Mình tìm được một vài linh kiện phù hợp (giá theo dữ liệu hiện có):\n" +
          first
            .map((p) => {
              const label = p.bienTheTen ? `${p.sanPhamTen} (${p.bienTheTen})` : p.sanPhamTen;
              return `- ${label}: ${Number(p.gia || 0).toLocaleString()} đ`;
            })
            .join("\n"),
        products: first.map((p) => ({
          sanPhamId: p.sanPhamId,
          sanPhamTen: p.sanPhamTen,
          bienTheTen: p.bienTheTen,
          gia: p.gia,
        })),
        quickPrompts: ["Giá RAM DDR5 bao nhiêu?", "Mã giảm giá hiện tại?"],
      });
    }

    // 4) Không khớp: gợi ý cách hỏi
    return res.json({
      reply:
        "Mình chưa tìm thấy dữ liệu khớp. Bạn thử hỏi theo mẫu nhé:\n" +
        "- 'Giá CPU i5 bao nhiêu?'\n" +
        "- 'Mã giảm giá hiện tại?'\n" +
        "- 'Tình trạng đơn hàng của tôi <mã đơn>'",
      quickPrompts: ["Giá CPU i5 bao nhiêu?", "Mã giảm giá hiện tại?", "Tình trạng đơn hàng của tôi"],
    });
  } catch (error) {
    res.status(500).json({
      reply: "Có lỗi khi xử lý yêu cầu chat. Bạn thử lại sau nhé.",
    });
  }
};

