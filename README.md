# Aurelle — Tiệc cưới & Sự kiện

Website giới thiệu thương hiệu giả định, giao diện và nội dung tiếng Việt. Mã nguồn HTML, CSS và JavaScript thuần; không framework, không npm, không cần bước build. Tất cả ảnh và font nằm trong thư mục dự án.

## Mở trong VS Code

1. Chọn **File → Open Folder… → D:\Business\_website2**.
2. Mở `index.html` bằng Chrome/Edge, hoặc dùng **Open with Live Server** nếu đã cài tiện ích Live Server.
3. Sửa mã nguồn, lưu và tải lại trình duyệt. Không cần cài thêm thư viện.

## Cấu trúc mã nguồn

```text
index.html                 Nội dung tiếng Việt, SEO và cấu trúc trang
css/variables.css          Màu sắc, font, khoảng cách và kích thước
css/global.css             Giao diện, hiệu ứng và các thành phần
css/responsive.css         Điều chỉnh theo kích thước màn hình
js/main.js                 Menu, FAQ, cửa sổ chi tiết và biểu mẫu
assets/images/             10 ảnh cục bộ: 7 ảnh nguồn + 3 ảnh tạo bằng AI
assets/fonts/              6 tệp font Latin/tiếng Việt và giấy phép OFL
ASSET-CREDITS.md            Nguồn ảnh và font
IMAGE-PROMPTS.md            Mô tả dùng để tạo 3 ảnh AI
```

## Giao diện hiện tại

- Hero ảnh tràn khung với tông kem, champagne và nâu đồng.
- 5 nhóm dịch vụ: tổ chức tiệc cưới, sự kiện cá nhân, sự kiện doanh nghiệp, thiết kế & trang trí, tư vấn & điều phối. Mỗi nhóm có ảnh, biểu tượng và cửa sổ mô tả phạm vi.
- Giới thiệu thương hiệu kết hợp ảnh lớn và ba cam kết dịch vụ.
- 5 dự án ý tưởng có cửa sổ câu chuyện riêng.
- Quy trình 4 bước, ngân sách tham khảo, 6 câu hỏi thường gặp, cảm nhận minh họa và lời mời liên hệ.
- Khoảng cách giữa các phần đã thu gọn; dịch vụ và dự án xếp thành 5 cột trên desktop, tự đổi bố cục trên tablet/điện thoại.
- Menu di động, trạng thái điều hướng khi cuộn, hiệu ứng ảnh khi rê chuột, hiệu ứng xuất hiện nhẹ và FAQ đóng/mở. Tôn trọng thiết lập giảm chuyển động của người dùng.

## Chỉnh sửa nội dung

- Văn bản, tiêu đề, SEO và tên thương hiệu: `index.html`.
- Chi tiết 5 dịch vụ và 5 dự án: đối tượng `services` và `projects` ở cuối `js/main.js`.
- Tông màu, font, khoảng cách giữa các phần: `css/variables.css`, đặc biệt `--section-space`.
- Bố cục trên điện thoại: `css/responsive.css`.
- Ảnh: thay ảnh trong `assets/images/`, cập nhật đường dẫn, mô tả `alt` và kích thước khi cần.
- Liên hệ, email và mạng xã hội: thay nút minh họa bằng thông tin chính thức.
- Form: kết nối dịch vụ xử lý yêu cầu trước khi dùng cho khách hàng thật.

## Trạng thái chức năng

Form có kiểm tra họ tên, email và ngày; tự chọn dịch vụ khi mở từ cửa sổ chi tiết. Đây là **form trải nghiệm**, không gửi email, không lưu dữ liệu, không đặt lịch. Nội dung nhập được xóa khi đóng. Các cửa sổ hỗ trợ Tab, Escape và trả focus khi đóng.

Thương hiệu, dự án, tên khách, cảm nhận và giá 80.000.000₫ là nội dung minh họa. Ảnh stock/AI thể hiện phong cách, không phải bằng chứng về sự kiện đã tổ chức. Email và mạng xã hội chưa kết nối tài khoản thực.

## Kiểm tra trước bàn giao

Đã kiểm tra ở chiều rộng 1440, 1280, 1024, 768, 430 và 390px; không tràn ngang. Kiểm tra menu di động, 5 dịch vụ, 5 câu chuyện dự án, FAQ bằng bàn phím, biểu mẫu tiếng Việt, ảnh/font cục bộ và đường dẫn nội bộ. JavaScript không báo lỗi cú pháp hoặc lỗi console trong các luồng đã kiểm tra.

## GitHub và bản xem công khai

- Repository: https://github.com/datngoo/wedding-planner
- Website: https://datngoo.github.io/wedding-planner/
- GitHub Pages xuất bản từ nhánh `main`, thư mục gốc `/`.
- Tệp `.nojekyll` cho phép phục vụ trực tiếp website tĩnh, không cần bước build.

Sau khi sửa nội dung trong VS Code, vào **Source Control**, kiểm tra thay đổi, nhập nội dung commit, chọn **Commit**, sau đó **Sync Changes/Push**. Hoặc chạy trong Terminal tại thư mục dự án:

```sh
git add .
git commit -m "Cap nhat noi dung website"
git push
```

GitHub Pages sẽ cập nhật sau khi tiến trình triển khai hoàn tất. Theo dõi trạng thái ở mục **Actions** hoặc **Settings → Pages** của repository. Không đưa mật khẩu, token hay cấu hình riêng tư vào mã nguồn.

Bản công khai vẫn dùng nội dung minh họa và form trải nghiệm như mô tả ở trên. Cập nhật thông tin doanh nghiệp, nội dung thật, form và chính sách trước khi sử dụng để tiếp nhận khách hàng thực tế.
