
# Lịch Rảnh

Tool khảo sát lịch rảnh cho nhóm. Mỗi người tick ca rảnh của mình, bảng tổng hợp hiện realtime cho tất cả.

**Live:** https://caulong-2974b.web.app

## Deploy

```bash
firebase deploy --only hosting
```

## Stack

- **Frontend:** React 18 (CDN, không build step)
- **Auth:** Firebase Authentication — Google OAuth
- **Database:** Firestore (realtime)
- **Hosting:** Firebase Hosting

## Structure

```
caulong/
├── index.html      # Toàn bộ app
├── firebase.json   # Hosting config
└── .firebaserc     # Project alias
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

## Firestore Rules

```
match /schedules/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

