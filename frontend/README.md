# Graduation Thesis Management - Frontend (SOA Consumer)

Hệ thống giao diện người dùng Quản lý Đề tài Tốt nghiệp, được thiết kế theo chuẩn **Kiến trúc Hướng Dịch vụ (Service-Oriented Architecture - SOA)** đóng vai trò là **Service Consumer** và **Service Aggregator**.

---

## 🏛️ Kiến trúc SOA trong Frontend

### 1. Tính trong suốt về vị trí (Location Transparency)
- Frontend hoàn toàn **không phụ thuộc vào địa chỉ vật lý** (IP, Port) của các backend microservice.
- Mọi truy vấn từ trình duyệt đều đi qua lớp Reverse Proxy / Gateway thống nhất (`/api/...`):
  - Sinh viên: `/api/students` ➔ định tuyến đến `student-service`
  - Đề tài: `/api/theses` ➔ định tuyến đến `thesis-service`
  - Đăng ký: `/api/registrations` ➔ định tuyến đến `registration-service`
  - Báo cáo PDF: `/api/reports` ➔ định tuyến đến `report-service`
- Toàn bộ giao diện người dùng và thông báo lỗi không để lộ thông tin hạ tầng mạng (ports, raw IPs).

### 2. Tầng Chống Ăn Mòn (Anti-Corruption Layer - ACL) & DTOs
- Mỗi domain nghiệp vụ sở hữu một module DTO riêng (`src/modules/*/dto/`):
  - `validate*`: Kiểm tra tính toàn vẹn của dữ liệu tại ranh giới người dùng trước khi gửi đi.
  - `to*Payload`: Chuyển đổi dữ liệu từ form UI thành cấu trúc Payload đúng Hợp đồng Dịch vụ (Service Contract).
  - `from*Response`: Chuẩn hóa dữ liệu trả về từ Microservices về cấu trúc chuẩn dùng cho UI.
- Đảm bảo các component hiển thị (Presentational / Dumb Components) không bị phụ thuộc trực tiếp vào định dạng thô của cơ sở dữ liệu backend.

### 3. Phối hợp Dịch vụ (Service Orchestration & Composition)
- Module `registrationCompositeService` (`src/modules/registration/services/`) đóng vai trò là **SOA Composite Aggregator**:
  - Gọi song song 3 dịch vụ (`student-service`, `thesis-service`, `registration-service`) để tổng hợp màn hình điều phối đồ án tốt nghiệp.
  - **Khả năng chịu lỗi từng phần (Graceful Degradation):** Nếu một trong các microservice gặp sự cố, hệ thống vẫn duy trì hoạt động với dữ liệu fallback và cảnh báo rõ ràng dịch vụ đang offline.

---

## 📁 Cấu trúc Thư mục

```text
frontend/src/
├── core/                       # Thành phần dùng chung toàn hệ thống
│   ├── gateway/config.js       # Cấu hình địa chỉ dịch vụ và proxy
│   └── http/httpClient.js      # HTTP Client chuẩn hóa lỗi và timeout
├── modules/                    # Phân chia theo SOA Domain
│   ├── student/                # Domain Sinh viên (api, dto)
│   ├── thesis/                 # Domain Đề tài (api, dto)
│   ├── registration/           # Domain Đăng ký & Composite Aggregator
│   └── report/                 # Domain Báo cáo xuất PDF (api)
├── components/                 # Dumb / Presentational Components
│   ├── common/                 # UI dùng chung (Alert, Modal, Badge, Monitor)
│   ├── student/                # StudentForm, StudentTable
│   ├── thesis/                 # ThesisForm, ThesisTable
│   └── registration/           # RegistrationForm, RegistrationTable
└── views/                      # Smart / Container Components
    ├── StudentView.svelte
    ├── ThesisView.svelte
    └── RegistrationView.svelte
```

---

## 🛠️ Hướng dẫn Chạy & Kiểm thử

```bash
# Cài đặt thư viện
pnpm install

# Khởi chạy môi trường phát triển (Port 5173)
pnpm dev

# Kiểm tra cú pháp và kiểu dữ liệu Svelte (0 errors, 0 warnings)
pnpm check

# Chạy toàn bộ bộ kiểm thử tự động (106 unit & integration tests)
pnpm test

# Đóng gói sản phẩm (Production build)
pnpm build
```
