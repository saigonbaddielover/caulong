# Lịch Rảnh

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
├── scripts/
│   └── daily-reset.js                # Script reset slot hàng ngày
├── .github/
│   └── workflows/
│       └── daily-reset.yml           # Cron trigger 23:00 GMT+7
├── firebase.json                     # Hosting config
└── .firebaserc                       # Project alias
```

## Firestore Schema

Collection: `schedules`

```
schedules/{uid}
  ├── name: string        # displayName từ Google
  ├── photo: string       # photoURL từ Google
  ├── slots: string[]     # ["T2-08:00", "T4-14:30", ...]
  └── updatedAt: number   # timestamp
```

Slot key format: `{thứ}-{giờ}` — không lưu ngày cụ thể, dùng lại mỗi tuần.

## Firestore Rules

```
match /schedules/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## Auto Reset

Mỗi ngày lúc **23:00 GMT+7**, GitHub Actions tự động xoá slots của đúng ngày hôm đó khỏi tất cả user. Các ngày còn lại không bị ảnh hưởng.

Cần set GitHub Secret `FIREBASE_SERVICE_ACCOUNT` = nội dung file JSON service account từ Firebase Console → Project Settings → Service accounts.

## Deploy

```bash
firebase deploy --only hosting
```