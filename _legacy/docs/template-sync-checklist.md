# Template Sync Checklist

Khi chỉnh `design/template.html`, check nhanh:

1. Mày đang sửa phần nào?
   - Nếu là layout / component / JSX / grid / modal / tương tác UI: sửa trong template.
   - Nếu là Firebase / auth / Firestore: sửa trong index.

2. Sau khi sửa template:
   - chạy `node scripts/sync-template.js`

3. Sau khi sync:
   - confirm `index.html` vẫn còn `<script type="module">` Firebase block
   - confirm login flow vẫn giữ nguyên
   - confirm không có reference mới mà data-layer chưa cấp

4. Nếu thêm UI mới dùng data mới:
   - thêm state/callback production vào `index.html`
   - thêm mock tương ứng vào `design/template.html`
   - giữ đúng contract tên biến để lần sau sync không vỡ

## Rule ngắn

- UI-first: sửa `design/template.html`
- Data-first: sửa `index.html`
- Sync bằng script, không copy tay từng đoạn nữa
