# Template Sync Contract

`design/template.html` là source of truth cho UI. `index.html` chỉ giữ phần production-specific:

- Firebase init
- auth lifecycle
- Firestore read/write
- mock/real data source

## Sync zones

Script `node scripts/sync-template.js` sẽ copy đúng các zone này từ `design/template.html` sang `index.html`:

1. `SHARED_CONSTANTS`
2. `SHARED_UTILS`
3. `SHARED_COMPONENTS`
4. `APP_SHARED_STATE`
5. `APP_RENDER`

## Không được sửa tay trong `index.html`

Nếu phần sửa nằm trong zone ở trên thì sửa trong `design/template.html`, rồi chạy sync script.

## Được sửa trực tiếp trong `index.html`

Chỉ sửa các phần ngoài zone:

- `<script type="module">` Firebase bootstrap
- login/logout/auth hooks
- Firestore subscribe/save logic
- production-only guards như loading/login screen gate
- callback data handlers:
  - `save`
  - `toggleFixed`
  - `handleSelectAll`
  - `handleClearAll`
  - `applySlotSelectionRange`
  - `saveBooking`
  - `handleFinalSave`

## Data contract mà UI đang expect

Các biến/state:

- `user`
- `allSchedules`
- `mySlots`
- `fixed`
- `syncing`
- `bookedSlots`
- `idleSyncLabel`

Các callback:

- `logout`
- `toggleFixed`
- `handleSelectAll`
- `handleClearAll`
- `applySlotSelectionRange(action, range)`
- `handleFinalSave`

## Quy trình chuẩn

1. Sửa UI trong `design/template.html`
2. Chạy `node scripts/sync-template.js`
3. Mở `index.html` kiểm tra runtime
4. Nếu UI cần thêm data mới, chỉ bổ sung phần data-layer ở `index.html`
