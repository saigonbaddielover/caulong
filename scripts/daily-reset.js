// scripts/daily-reset.js
// Chạy lúc 23:00 GMT+7 (16:00 UTC) hàng ngày
// Xoá slots của ngày hôm nay (theo thứ trong tuần) khỏi tất cả user

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const DAY_MAP = {
    0: 'CN',
    1: 'T2',
    2: 'T3',
    3: 'T4',
    4: 'T5',
    5: 'T6',
    6: 'T7',
};

async function run() {
    // Service account từ GitHub Secret (inject qua env)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    initializeApp({ credential: cert(serviceAccount) });
    const db = getFirestore();

    // Lấy thứ hiện tại theo GMT+7
    const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const todayKey = DAY_MAP[now.getUTCDay()]; // vd: "T3"

    console.log(`Resetting slots for: ${todayKey}`);

    const snapshot = await db.collection('schedules').get();

    if (snapshot.empty) {
        console.log('No documents found.');
        return;
    }

    const batch = db.batch();
    let count = 0;

    snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();

        // Bỏ qua user đã bật lịch cố định
        if (data.fixed === true) {
            console.log(`Skipped (fixed): ${docSnap.id}`);
            return;
        }

        const slots = data.slots ?? [];

        // Chỉ lọc slots của đúng ngày hôm nay
        const filtered = slots.filter(slot => !slot.startsWith(`${todayKey}-`));

        if (filtered.length !== slots.length) {
            batch.update(docSnap.ref, { slots: filtered });
            count++;
        }
    });

    if (count > 0) {
        await batch.commit();
        console.log(`Updated ${count} user(s).`);
    } else {
        console.log('No slots to clear today.');
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});