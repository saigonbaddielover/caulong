# Template Sync Contract

`design/template.html` là source of truth cho shared UI shell. `index.html` chỉ giữ phần production-specific:

- Firebase init
- auth lifecycle
- Firestore read/write
- embedded browser guard
- mock/real data source adapter

## Sync zones

Script `node scripts/sync-template.js` sẽ copy đúng các zone này từ `design/template.html` sang `index.html`:

1. `SHARED_CONSTANTS`
2. `SHARED_UTILS`
3. `SHARED_COMPONENTS`
4. `SHARED_SHELL`

## Không được sửa tay trong `index.html`

Nếu phần sửa nằm trong zone ở trên thì sửa trong `design/template.html`, rồi chạy sync script.

## Được sửa trực tiếp trong `index.html`

Chỉ sửa các phần ngoài zone:

- `<script type="module">` Firebase bootstrap
- login/logout/auth hooks
- Firestore subscribe/save logic
- production-only guards:
  - `EmbeddedBrowserBlockedScreen`
  - `getEmbeddedBrowserContext`
  - `openCurrentUrlInChrome`
  - `openCurrentUrlInExternalBrowser`
  - `copyCurrentUrl`
- production `App()` adapter

## Data contract của `AppShell`

Props:

- `user`
- `idleSyncLabel`
- `syncing`
- `allSchedules`
- `mySlots`
- `fixed`
- `bookedSlots`
- `onLogout()`
- `onSaveSchedule(nextSlots, nextFixed)`
- `onSaveBookings({ newSelection, deleteSelection, selectedCourt })`

Quy tắc:

- `AppShell` chỉ giữ UI-local state và derived data thuần giao diện
- mọi thay đổi persisted phải đi qua `onSaveSchedule` hoặc `onSaveBookings`
- `index.html` không được đưa Firebase/Auth/Firestore vào shared zone
- `design/template.html` không được sync mock persistence logic sang production

## Quy trình chuẩn

1. Sửa shared UI shell trong `design/template.html`
2. Chạy `node scripts/sync-template.js`
3. Kiểm tra `index.html` vẫn giữ nguyên production adapter và embedded-browser fix
4. Mở `index.html` kiểm tra runtime
5. Nếu UI cần thêm data mới, chỉ bổ sung phần data-layer ở adapter tương ứng
