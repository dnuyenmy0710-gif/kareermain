# Kareer Project Setup Guide

Chào mừng bạn đến với dự án Kareer - Nền tảng định hướng nghề nghiệp thông minh dành cho Gen Z.

## 1. Cấu trúc dự án

- `/`: Trang chủ và onboarding.
- `/Step 2`: Module trắc nghiệm và kết quả phân tích.
- `/Step_3_Matrix`: Ma trận nghề nghiệp, lộ trình thăng tiến và kế hoạch học tập.
- `/backend`: Server Node.js/Express và scripts quản lý database (Supabase).
- `api-client.js`: Thư viện kết nối frontend với backend.
- `config.js`: Cấu hình URL API cho toàn dự án.

## 2. Hướng dẫn cài đặt Backend

Dự án sử dụng **Node.js** và **Supabase** (PostgreSQL).

### Bước 1: Cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 2: Cấu hình môi trường
Tạo file `.env` trong thư mục `backend/` với nội dung:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

### Bước 3: Khởi tạo Database
Chạy script migration để tạo các bảng cần thiết:
```bash
node migrate.js
```
*Lưu ý: Nếu script gặp lỗi quyền, hãy copy nội dung file `migration.sql` và chạy trực tiếp trong SQL Editor của Supabase.*

### Bước 4: Chạy Server
```bash
npm start
```

## 3. Hướng dẫn cài đặt Frontend

### Bước 1: Cập nhật config
Mở file `config.js` ở thư mục gốc và cập nhật URL của backend:
```javascript
const Kareer_API_URL = "http://localhost:3000"; // Hoặc URL đã deploy
```

### Bước 2: Chạy local
Bạn có thể sử dụng bất kỳ static server nào (như `Live Server` trên VS Code) để mở file `index.html`.

## 4. Deploy

- **Frontend**: Có thể deploy lên Vercel, Netlify hoặc GitHub Pages.
- **Backend**: Có thể deploy lên Railway, Render hoặc Vercel (chuyển đổi sang Serverless Functions).
- **Database**: Sử dụng trực tiếp dịch vụ Cloud của Supabase.

## 5. Liên hệ
Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ đội ngũ phát triển.
