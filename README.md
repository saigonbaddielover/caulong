# Lịch Rảnh 🏸

Tool khảo sát lịch rảnh cho nhóm. Mỗi người tick ca rảnh của mình, bảng tổng hợp hiện realtime cho tất cả.

**Live:** https://caulong-2974b.web.app

## Stack

- **Frontend:** React 18 (CDN, không build step)
- **Auth:** Firebase Authentication — Google OAuth
- **Database:** Firestore (realtime)
- **Hosting:** Firebase Hosting
- **Cron:** GitHub Actions

## Structure

```
caulong/
├── index.html                        # Toàn bộ app
├── dev/
│   └── mock.html                     # UI mock, không deploy
├── scripts/
│   └── daily-reset.js                # Script reset slot hàng ngày
├── .github/
│   └── workflows/
│       └── daily-reset.yml           # Cron trigger 23:00 GMT+7
├── firebase.json                     # Hosting config
└── .firebaserc                       # Project alias
```

## Firestore Schema

Collection `schedules` — lịch cá nhân từng user:
```
schedules/{uid}
  ├── name: string        # displayName từ Google
  ├── photo: string       # photoURL từ Google
  ├── fixed: boolean      # true = không bị auto-reset hàng ngày
  ├── slots: string[]     # ["T2-08:00", "T4-14:30", ...]
  └── updatedAt: number   # timestamp
```

Collection `court` — lịch đặt sân chung (shared, ai cũng đọc/ghi được):
```
court/global
  └── slots: map              # object, key = slot key
        ├── "T2-08:00": { court: "EZB Đằng Hải", user: "Mạnh Nguyễn" }
        └── "T4-14:30": { court: "Phú Cường", user: "An Tran" }
```

Slot key format: `{thứ}-{giờ}` — không lưu ngày cụ thể, dùng lại mỗi tuần.

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schedules/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /court/global {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Auto Reset

Mỗi ngày lúc **23:00 GMT+7**, GitHub Actions tự động:
- Xoá slots của đúng ngày hôm đó khỏi tất cả user (trừ user có `fixed: true`)
- Xoá court bookings của ngày hôm đó

Cần set GitHub Secret `FIREBASE_SERVICE_ACCOUNT` = nội dung file JSON service account từ Firebase Console → Project Settings → Service accounts.

## Deploy

```bash
firebase deploy --only hosting
```

1. EZB Đằng Hải - 0779766333 - 84 Lũng Bắc
2. EZB Cầu Niệm - 0934275222 - 22 Tân Hà
3. EZB An Đồng - 0369633444 - 87 đường 302
4. EZB Văn Cao - 0914616818 - 14/333B Văn Cao
5. Phú Cường - 0333766333 - 135 Quán Trữ
6. Hải Tiến -  0906903555 - lô 9 Lê Hồng Phong
7. Giang Lakaika - 0945433979 - 50 An Trực
8. TD - 0971186416 - 34/3B Lê Hồng Phong
9. Phoenix 1 - 0976171250 - số 28, ngõ 739, Nguyễn Văn Linh
10. Phoenix 2 - 0976171250 - ngõ Nguyễn Sơn Hà, 727 Nguyễn Văn Linh

0976171250
