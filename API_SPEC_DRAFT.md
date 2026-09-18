# Ecoleaf GPT - API Specification Draft (Sprint 1)

Base URL: `/api/v1`

---

## 1. Chat & Research Assistant
### POST `/api/chat`
ส่งคำถามเพื่อค้นคว้าข้อมูลและรับคำตอบพร้อม Citation แหล่งอ้างอิง

* **Request Body:**
```json
{
  "message": "โครงการลดการปล่อยคาร์บอนมีวิธีประเมินอย่างไร?",
  "sessionId": "optional-session-id"
}