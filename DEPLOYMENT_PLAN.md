# Ecoleaf Platform - Architecture, Deployment & Operations Plan (Phase 0)

เอกสารนี้เป็นแนวทางสำหรับการพัฒนา ทดสอบ Deploy และดูแลระบบ Ecoleaf Platform
โดยรายการที่ยังไม่ได้ระบุว่าใช้งานแล้วให้ถือเป็นแผนงานที่ต้องดำเนินการก่อน Production

## 1. Scope and Delivery Status

| Area | Status | Target / Evidence |
| --- | --- | --- |
| Next.js App Router, TypeScript & Tailwind CSS (App Shell) | **Completed** | Phase 0 (Done) |
| PostgreSQL & Prisma ORM Schema Design (v5.22.x) | **Completed** | Phase 0 (Done) |
| GitHub Actions CI Pipeline (Lint, Generate, Build) | **Completed** | Phase 0 (Done) |
| API Specifications Draft (All 5 Domains) | **Completed** | Phase 0 (Done) |
| FastAPI AI Engine integration | Planned | Sprint 1 |
| Authentication ด้วย NextAuth.js (Auth.js) | Planned | Sprint 1 |
| Automated Unit / Integration Tests & Vulnerability Scan | Planned | Sprint 2 - Sprint 4 |
| Centralized Monitoring, Backup & Disaster Recovery Test | Planned | Pre-Production (Sprint 4-6) |

## 2. System Architecture Overview

- **Frontend & API Gateway:** Next.js (App Router, TypeScript, Tailwind CSS)
- **AI Service Integration:** เชื่อมต่อกับ FastAPI AI Engine
  (พัฒนาโดย Tanarat & Tanatorn) ผ่าน REST API และ JSON contract ที่มีการ
  versioning
- **Database & ORM:** PostgreSQL รองรับข้อมูลผู้ใช้ บันทึกการสนทนา ผลกระทบ
  สิ่งแวดล้อม และเหรียญรางวัลผ่าน Prisma ORM (v5.x)
- **Service Boundary:** Next.js ต้องกำหนด timeout, retry และการจัดการเมื่อ
  FastAPI ไม่พร้อมให้บริการ โดยห้าม retry คำขอที่ไม่ idempotent โดยไม่มี
  idempotency key

## 3. Environment and Secret Management

- แยก Environment อย่างน้อย `development`, `staging` และ `production`
- ห้ามใช้ Production database กับ Local หรือ Test environment
- จัดเก็บ `DATABASE_URL`, `AUTH_SECRET`, AI Service credentials และ OAuth
  credentials ผ่าน Secret Manager หรือระบบจัดการ Secret ของผู้ให้บริการ Cloud
- ห้าม commit Secret, token, password หรือ private key ลงใน Repository
- ตรวจสอบ Environment Variables ที่จำเป็นตอนเริ่มระบบ และทำให้ระบบหยุดพร้อม
  error ที่ชัดเจนเมื่อค่าที่จำเป็นหายไป
- จำกัดสิทธิ์ของ Database และ Service Account ตามหลัก Least Privilege และ
  กำหนดกระบวนการหมุนเวียน Secret/API Key

## 4. Authentication and Authorization

- **Implementation:** เตรียมนำ NextAuth.js (Auth.js) มาใช้งานร่วมกับตาราง
  `User` ใน Prisma
- **Session Cookies:** ใช้ `HttpOnly` เพื่อลดความเสี่ยงที่ JavaScript จะอ่าน
  Session Cookie, ใช้ `Secure` ใน Production และใช้ `SameSite=Lax` หรือ
  `SameSite=Strict` ตามความเข้ากันได้ของระบบ
- ใช้ HTTPS เท่านั้นใน Staging และ Production
- กำหนด Session expiration, Logout และการยกเลิก Session ที่ชัดเจน
- ป้องกัน CSRF สำหรับคำขอที่เปลี่ยนแปลงข้อมูล และตรวจสอบสิทธิ์ทุก Protected
  Route
- รองรับ Email Magic Link / OAuth โดยจัดเก็บ Provider Secret ผ่าน Secret
  Manager เท่านั้น

## 5. API Contract and Error Handling

- ใช้ Error Format กลาง:

  ```json
  {
    "error": {
      "code": "STRING",
      "message": "STRING",
      "details": {}
    }
  }
  ```

- ทุก Endpoint ต้องส่ง HTTP Status Code ให้สอดคล้องกับผลลัพธ์ และไม่เปิดเผย
  Stack Trace หรือข้อมูลลับให้ Client
- กำหนด Request/Response Schema ระหว่าง Next.js และ FastAPI พร้อม validation
  ก่อนส่งและหลังรับข้อมูล
- กำหนด API version, timeout, retry/backoff และ correlation ID สำหรับติดตาม
  Request ข้าม Service
- เมื่อ AI Service ล่ม ให้ส่ง Error ที่สื่อความหมายและมี fallback ตามที่
  Product กำหนด โดยไม่สร้างคำตอบสำเร็จปลอม

## 6. Logging, Privacy and Observability

- ใช้ Centralized Logging พร้อม PII Masking ก่อนบันทึก
- ห้ามบันทึก Password, Token, Cookie, OAuth Secret หรือข้อมูลส่วนบุคคลที่
  ไม่จำเป็น
- ใช้ structured log ที่มี timestamp, environment, service, request ID และ
  ระดับความรุนแรง
- จัดทำ `/api/health` สำหรับ Liveness และ Readiness Check
- ติดตามอย่างน้อย API latency, error rate, database connectivity และ AI
  Service availability
- ตั้ง Alert สำหรับเหตุการณ์ P0/P1 และเก็บ Audit Log สำหรับการเปลี่ยนแปลง
  สิทธิ์หรือข้อมูลสำคัญ

## 7. CI/CD and Automated Testing

- ใช้ GitHub Actions workflow `ci.yml` ตรวจสอบอัตโนมัติทุกครั้งที่ Push หรือเปิด Pull Request ไปยัง Branch หลัก
- **Baseline Pipeline (Phase 0 - Active):**
  1. ติดตั้งสภาพแวดล้อม Node.js 22 และ Dependency ด้วย `npm ci`
  2. จัดการ Cache Dependency ผ่าน `package-lock.json`
  3. สร้าง Prisma Client ด้วย `npx prisma generate`
  4. ตรวจสอบคุณภาพโค้ดด้วย Linter (`npm run lint`)
  5. ทดสอบคอมไพล์ระบบและ Type Check ด้วย `npm run build`
- **Future Pipeline Enhancements (Sprint 1 - Sprint 4):**
  - เพิ่มขั้นตอน Automated Unit & Integration Tests เมื่อเริ่มมี Business Logic
  - เพิ่ม Dependency Vulnerability Audit (`npm audit`)
- ก่อน Deploy Production ให้ Deploy ไป Staging และทำ Smoke Test/Health Check ให้ผ่านก่อน
- เก็บผลลัพธ์ของ CI และ Build Artifact เพื่อใช้ตรวจสอบย้อนหลัง

## 8. Database Migration Policy

- ใช้ `prisma migrate deploy` ใน Staging และ Production
- ห้ามใช้ `prisma db push` ใน Production
- Migration ที่ลบหรือเปลี่ยนรูปแบบข้อมูลต้องผ่าน Code Review และมี Backup
  ก่อนดำเนินการ
- ใช้ Expand/Contract Migration เมื่อจำเป็นต้องรองรับ Application หลาย Version
  ระหว่าง Deploy
- ระบุวิธีแก้ไขหรือกู้คืนสำหรับ Migration ที่ย้อนกลับไม่ได้ใน Pull Request

## 9. Deployment and Rollback

- **Hosting:** ใช้ Cloud Platform ที่รองรับ Serverless หรือ Container และ
  Zero-Downtime Deployment
- **Release:** Deploy ตามลำดับ `staging -> smoke test -> production`
- **Rollback:** เมื่อพบปัญหาระดับ P0/P1 ให้หยุดการ Promote และย้อน Application
  กลับไปยัง Commit ล่าสุดที่ผ่านการตรวจสอบ
- หากมี Database Schema Change ให้ปฏิบัติตาม Migration Policy ก่อน Rollback
  Application เพื่อป้องกัน Version ไม่เข้ากัน
- กำหนดผู้อนุมัติ ช่องทางแจ้งเหตุ และบันทึก Timeline สำหรับ Incident ทุกครั้ง

## 10. Backup, Restore and Recovery

- ทำ Automated Daily Backup หรือ Snapshot ของ PostgreSQL และเข้ารหัสทั้งขณะ
  จัดเก็บและขณะส่งผ่านเครือข่าย
- เก็บ Backup แยกจากฐานข้อมูลหลัก โดยมี Retention Period อย่างน้อย 30 วัน
- กำหนดเป้าหมายการกู้คืน:
  - **RPO:** ข้อมูลสูญหายได้ไม่เกินระยะเวลาที่ Product กำหนด
  - **RTO:** ระบบต้องกลับมาให้บริการภายในระยะเวลาที่ Product กำหนด
- ทดสอบ Restore อย่างน้อยรายเดือนใน Environment ที่แยกจาก Production และ
  บันทึกผลการทดสอบ
- ตรวจสอบความสมบูรณ์ของ Backup และแจ้งเตือนเมื่อ Backup หรือ Restore Test
  ล้มเหลว

## 11. Production Readiness Checklist

- [ ] Environment และ Secret แยกจากกันครบถ้วน
- [ ] Authentication, Authorization และ HTTPS ผ่านการตรวจสอบ
- [ ] CI ผ่าน Type Check, Lint, Tests, Dependency Scan และ Build
- [ ] Prisma Migration ผ่านการ Review และทดสอบใน Staging
- [ ] Health Check, Logging, Metrics และ Alerting พร้อมใช้งาน
- [ ] มี Backup ล่าสุดและ Restore Test ที่ผ่าน
- [ ] ระบุ RPO, RTO, ผู้รับผิดชอบ และขั้นตอน Rollback แล้ว
