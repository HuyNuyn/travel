# Wayfare — Lập kế hoạch du lịch nhóm

Đây là Giai đoạn 1 của project. App đã có: đăng ký/đăng nhập, tạo chuyến đi,
mời thành viên bằng email, và phân công công việc. Phần bản đồ Google Maps,
lịch trình theo ngày và chia tiền sẽ được xây ở giai đoạn tiếp theo (khung
dữ liệu cho các phần này đã có sẵn trong database).

Hướng dẫn dưới đây viết cho người **chưa biết code** — làm theo từng bước,
không cần gõ lệnh gì trên máy. Tổng thời gian khoảng 20–30 phút, hoàn toàn
miễn phí.

## Bạn sẽ cần tạo 3 tài khoản miễn phí

| Dịch vụ | Dùng để làm gì |
| --- | --- |
| [supabase.com](https://supabase.com) | Lưu dữ liệu (người dùng, chuyến đi, chi tiêu...) |
| [github.com](https://github.com) | Lưu trữ code |
| [vercel.com](https://vercel.com) | Chạy trang web thật, cho bạn một địa chỉ public |

---

## Bước 1 — Tạo cơ sở dữ liệu trên Supabase

1. Vào [supabase.com](https://supabase.com) → **Start your project** → đăng ký
   (dùng email hoặc GitHub đều được).
2. Bấm **New project**. Đặt tên (ví dụ `wayfare`), đặt một mật khẩu database
   — **lưu lại mật khẩu này ở đâu đó**, chọn Region gần Việt Nam nhất
   (Singapore), rồi bấm **Create new project**. Đợi khoảng 1–2 phút.
3. Ở menu bên trái, mở **SQL Editor** → **New query**. Mở file
   `supabase/schema.sql` (nằm trong project mình gửi), copy **toàn bộ nội
   dung**, dán vào ô query, bấm **Run**. Thấy "Success" là toàn bộ bảng dữ
   liệu và bảo mật đã được tạo xong — không cần làm gì thêm ở đây.
4. Lấy thông tin kết nối: bấm nút **Connect** ở đầu trang (nếu không thấy,
   vào **Project Settings → API Keys**). Bạn sẽ thấy:
   - **Project URL** — dạng `https://xxxxx.supabase.co`
   - Một key để dùng ở phía client — có thể tên là **Publishable key**
     (tab mới) hoặc **anon / public key** (tab **Legacy API Keys**), copy
     1 trong 2 cái là đủ.

   Giữ lại 2 giá trị này, Bước 3 sẽ cần dùng.
5. Vào **Authentication → URL Configuration**: tạm điền **Site URL** là
   `http://localhost:3000` (sẽ sửa lại ở Bước 3 sau khi có địa chỉ thật).
   Vào **Authentication → Providers → Email**: có ô **Confirm email** —
   nên **để bật** (người dùng cần xác nhận email mới đăng nhập được, an
   toàn hơn cho một trang public).

---

## Bước 2 — Đưa code lên GitHub

1. Tạo tài khoản tại [github.com](https://github.com) (miễn phí).
2. Bấm **New repository**. Đặt tên (ví dụ `wayfare`), chọn Public hoặc
   Private tùy bạn, **không tick** "Add a README file", bấm **Create
   repository**.
3. Ở trang repo vừa tạo (đang trống), bấm vào link **uploading an existing
   file**.
4. Giải nén file `.zip` mình gửi ra một thư mục trên máy bạn. Mở thư mục
   đó, **chọn tất cả file và thư mục bên trong** (Ctrl+A / Cmd+A), kéo thả
   vào vùng upload của GitHub.
5. Đợi upload xong, gõ một dòng commit message bất kỳ (ví dụ "Khởi tạo
   project"), bấm **Commit changes**.

---

## Bước 3 — Triển khai lên Vercel (cho ra trang web thật)

1. Vào [vercel.com](https://vercel.com) → **Continue with GitHub** để đăng
   ký bằng chính tài khoản GitHub vừa tạo.
2. Bấm **Add New... → Project**, chọn repo `wayfare` vừa upload → **Import**.
3. Ở phần **Environment Variables**, thêm đúng 2 dòng (lấy giá trị từ Bước
   1.4):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<key bạn đã copy>
   ```

   Để trống `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — sẽ điền ở Giai đoạn 2.
4. Bấm **Deploy**, đợi 1–2 phút.
5. Xong! Vercel cho bạn một địa chỉ dạng
   `https://wayfare-xxxx.vercel.app` — đây là trang web public của bạn.
6. **Quan trọng:** quay lại Supabase → **Authentication → URL
   Configuration**, đổi **Site URL** thành đúng địa chỉ Vercel ở trên, và
   thêm `https://wayfare-xxxx.vercel.app/**` vào **Redirect URLs**. Bấm
   **Save**. (Nếu quên bước này, link xác nhận email sẽ không hoạt động
   đúng.)

---

## Bước 4 — Kiểm tra thử

1. Mở địa chỉ Vercel của bạn, bấm **Bắt đầu miễn phí**, tạo một tài khoản.
2. Nếu Confirm email đang bật: mở email vừa nhận, bấm link xác nhận.
3. Tạo một chuyến đi thử, vào tab **Thành viên** mời thử một email khác,
   vào tab **Công việc** thêm thử một việc cần làm.

Mỗi khi bạn (hoặc mình) cập nhật code và upload lại lên GitHub, Vercel sẽ
**tự động deploy lại** — không cần lặp lại Bước 3.

---

## Giai đoạn 2 (sắp tới): chuẩn bị Google Maps API key

Phần bản đồ/địa điểm sẽ dùng Google Maps Platform. Bạn có thể chuẩn bị
trước để khi mình build phần này xong là dùng được ngay:

1. Vào [console.cloud.google.com](https://console.cloud.google.com), tạo
   một project mới.
2. Vào **APIs & Services → Library**, bật (Enable) 3 API: **Maps
   JavaScript API**, **Places API (New)**, **Directions API**.
3. Vào **APIs & Services → Credentials → Create credentials → API key**.
4. **Giới hạn key lại** (rất quan trọng): bấm vào key vừa tạo, ở "Application
   restrictions" chọn "Websites" và chỉ cho phép domain Vercel của bạn; ở
   "API restrictions" chỉ chọn 3 API ở bước 2. Việc này giúp người khác
   không lấy trộm key của bạn để dùng lung tung.
5. **Về chi phí:** Google yêu cầu nhập thẻ thanh toán dù dùng miễn phí, và
   từ năm 2025 mỗi API có một hạn mức miễn phí riêng mỗi tháng (không còn
   gói tín dụng 200 USD/tháng chung như trước). Với quy mô một nhóm bạn bè
   lên kế hoạch vài chuyến/năm, lượng dùng thực tế thường nằm trong hạn mức
   miễn phí. Để chắc chắn không bị tính phí ngoài ý muốn, vào **Billing →
   Budgets & alerts**, tạo một ngân sách nhỏ (ví dụ 2–5 USD) để được báo
   email nếu có dấu hiệu vượt mức.

Khi có key, bạn chỉ cần dán vào biến `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` ở
Vercel (Project Settings → Environment Variables) và deploy lại.

---

## Xử lý một số lỗi thường gặp

- **Không đăng nhập được / xác nhận email không có tác dụng**: kiểm tra lại
  Site URL và Redirect URLs ở Supabase có đúng địa chỉ Vercel chưa (Bước
  3.6).
- **Vercel báo lỗi build**: thường do thiếu hoặc sai tên biến môi trường —
  kiểm tra lại đúng tên `NEXT_PUBLIC_SUPABASE_URL` và
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, không có khoảng trắng dư.
- **Vào /trips thấy trống dù đã tạo chuyến đi**: khả năng cao là bước chạy
  `schema.sql` ở Bước 1.3 chưa thành công — mở lại SQL Editor, chạy lại
  file đó, xem có dòng báo lỗi đỏ nào không.

## Muốn đổi tên app hoặc màu sắc?

- Đổi tên hiển thị: sửa chữ "Wayfare" trong `src/components/Logo.tsx` và
  `src/app/layout.tsx`.
- Đổi màu chủ đề: sửa các biến màu trong `src/app/globals.css` (phần
  `:root`, ví dụ `--color-coral`).
