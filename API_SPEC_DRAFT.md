# Ecoleaf GPT – API Specification Draft (Sprint 1)

**Base URL:** `/api/v1`

---

## 1. Chat & Research Assistant

ระบบ AI ผู้ช่วยค้นคว้า ส่งคำถามเพื่อค้นคว้าข้อมูลและรับคำตอบพร้อมแหล่งอ้างอิง

### `POST /api/chat`

#### Request Body

```json
{
  "message": "โครงการลดการปล่อยคาร์บอนมีวิธีประเมินอย่างไร?",
  "sessionId": "optional-session-id"
}
```

#### Response Body `200 OK`

```json
{
  "sessionId": "session-cuid-123",
  "reply": "นี่คือข้อมูลการค้นคว้าจำลองสำหรับหัวข้อของคุณ ระบบกำลังเชื่อมโยงข้อมูลสิ่งแวดล้อม...",
  "citations": [
    "รายงานการฟื้นฟูสิ่งแวดล้อม 2026",
    "มาตรฐานคาร์บอนเครดิตสากล"
  ],
  "confidenceScore": 0.94
}
```

---

## 2. User & Authentication

ระบบผู้ใช้และข้อมูลเกาะ

### `GET /api/user/profile`

ดึงข้อมูลโปรไฟล์ผู้ใช้ แต้มสะสม และระดับของเกาะ

#### Response Body `200 OK`

```json
{
  "id": "cuid-user-123",
  "email": "user@example.com",
  "name": "Intouch",
  "greenPoints": 120,
  "xp": 450,
  "islandLevel": 1
}
```

---

## 3. Missions & Challenges

ระบบภารกิจประจำวัน

### `GET /api/missions/daily`

ดึงรายการภารกิจประจำวัน (Daily Challenge Card)

#### Response Body `200 OK`

```json
{
  "missions": [
    {
      "id": "m-01",
      "title": "พกกระบอกน้ำส่วนตัวลดขยะพลาสติก",
      "xpReward": 25,
      "status": "pending"
    }
  ]
}
```

### `POST /api/missions/complete`

ยืนยันการทำภารกิจสำเร็จ

#### Request Body

```json
{
  "missionId": "m-01"
}
```

#### Response Body `200 OK`

```json
{
  "success": true,
  "earnedXp": 25,
  "newTotalPoints": 145
}
```

---

## 4. Points & Impact Ledger

ระบบคะแนนและการบันทึกผลกระทบ

### `POST /api/impact/log`

บันทึกกิจกรรมลดคาร์บอนและแจก Green Points

#### Request Body

```json
{
  "activity": "แยกขยะรีไซเคิล 5 กิโลกรัม",
  "carbonSavedKg": 1.25,
  "pointsEarned": 50
}
```

#### Response Body `201 Created`

```json
{
  "id": "impact-cuid-456",
  "carbonSavedKg": 1.25,
  "pointsEarned": 50,
  "createdAt": "2026-09-18T14:00:00Z"
}
```

---

## 5. Badges & Eco-Island Deco Shop

ระบบเหรียญรางวัลและร้านค้าตกแต่งเกาะ

### `GET /api/badges`

ดึงรายการเหรียญรางวัลของผู้ใช้

#### Response Body `200 OK`

```json
{
  "badges": [
    {
      "id": "badge-01",
      "name": "Zero-Waste Pioneer",
      "unlocked": true,
      "unlockedAt": "2026-09-18T10:00:00Z"
    }
  ]
}
```

### `POST /api/island/shop/buy`

แลกซื้อไอเทมตกแต่งเกาะด้วยแต้ม Green Points / XP

#### Request Body

```json
{
  "itemId": "item-tree",
  "costXp": 300
}
```

#### Response Body `200 OK`

```json
{
  "success": true,
  "placedItemId": "placed-cuid-789",
  "remainingXp": 150
}
```
