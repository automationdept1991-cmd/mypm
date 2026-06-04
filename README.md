# Machine PM System 🏭

ระบบบำรุงรักษาเชิงป้องกัน (Preventive Maintenance) สำหรับเครื่องจักร  
รองรับการใช้งานออนไลน์และออฟไลน์ ติดตั้งเป็น App บนมือถือได้

## ฟีเจอร์หลัก

- ✅ บันทึกสถานะเครื่องจักร: **Good / Warning / Under Repair**
- 📷 ถ่ายรูปจากกล้องมือถือ บันทึกใน GitHub Gist อัตโนมัติ
- 👥 เลือกผู้ตรวจจากรายชื่อ (Import จาก Excel)
- 🏭 Import ข้อมูลเครื่องจักรจาก Excel (Tag, Description, Type, Location)
- ☁️ GitHub Gist Database — ซิงค์ข้ามอุปกรณ์
- 📊 สรุปผลและ Export CSV / HTML Report
- 📵 ใช้งาน **Offline** ได้ (PWA)

---

## วิธี Deploy ขึ้น GitHub Pages (ทำครั้งเดียว)

### ขั้นที่ 1 — สร้าง Repository ใหม่
1. ไปที่ [github.com/new](https://github.com/new)
2. ตั้งชื่อ repo เช่น `machine-pm`
3. เลือก **Public**
4. กด **Create repository**

### ขั้นที่ 2 — อัปโหลดไฟล์
อัปโหลดไฟล์ทั้งหมด 6 ไฟล์เข้า repo:

| ไฟล์ | คำอธิบาย |
|------|----------|
| `index.html` | แอปหลัก |
| `manifest.json` | ข้อมูล PWA (ชื่อ ไอคอน สี) |
| `sw.js` | Service Worker — ใช้งาน Offline ได้ |
| `icon-192.png` | ไอคอนแอป 192×192 |
| `icon-512.png` | ไอคอนแอป 512×512 |
| `README.md` | คู่มือนี้ |

> วิธีง่ายที่สุด: ลากไฟล์ทั้ง 6 วางในหน้า repo ได้เลย

### ขั้นที่ 3 — เปิด GitHub Pages
1. เข้าไปที่ **Settings** ของ repo
2. เมนูซ้าย เลือก **Pages**
3. Source → **Deploy from a branch**
4. Branch → **main** / root
5. กด **Save**

### ขั้นที่ 4 — เข้าใช้งาน
รอ 1–2 นาที แล้วเปิด:
```
https://[username].github.io/machine-pm/
```

---

## ติดตั้งเป็น App บนมือถือ

**Android (Chrome):**
1. เปิด URL ในข้อ 4
2. กด ⋮ (เมนู 3 จุด)
3. เลือก **"Add to Home screen"** หรือ **"Install app"**

**iPhone (Safari):**
1. เปิด URL ในข้อ 4 ใน **Safari เท่านั้น**
2. กด 📤 (ปุ่ม Share)
3. เลือก **"Add to Home Screen"**

---

## ตั้งค่าครั้งแรก (หลังเปิดแอป)

### 1. ตั้งค่า GitHub Gist (หน้า ⚙️ ตั้งค่า)
1. ไปที่ [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. ตั้งชื่อ เช่น `PM System`
3. เลือก scope: ✅ **gist**
4. กด **Generate token** แล้วคัดลอก
5. วาง Token ในช่อง "GitHub Token"
6. กด **สร้าง Gist ใหม่** → ระบบจะสร้างและบันทึก Gist ID อัตโนมัติ

### 2. นำเข้าเครื่องจักร (Excel)
คอลัมน์ที่ต้องมี:

| Tag | Description | Type | Location |
|-----|-------------|------|----------|
| MC-001 | เครื่องกลึง CNC | CNC Lathe | Building A |
| MC-002 | Compressor | Utility | Building B |

### 3. นำเข้าบุคลากร (Excel)
คอลัมน์ที่ต้องมี:

| ID | Name | Shift | Level |
|----|------|-------|-------|
| EMP001 | สมชาย ใจดี | A | Technician |
| EMP002 | สมหญิง รักงาน | B | Supervisor |

---

## การใช้งานออฟไลน์

- แอปจะ **cache ไฟล์ทั้งหมด** หลังเปิดครั้งแรกขณะออนไลน์
- บันทึก PM ได้แม้ไม่มีอินเทอร์เน็ต — ข้อมูลเก็บใน localStorage
- เมื่อกลับมาออนไลน์ กด **☁️ Push ขึ้น Gist** เพื่อซิงค์

---

## หมายเหตุด้านความปลอดภัย

- GitHub Token เก็บใน localStorage ของอุปกรณ์เท่านั้น ไม่ส่งไปที่อื่น
- ใช้ Private Gist — เฉพาะคนที่มี Token เท่านั้นที่เข้าถึงได้
- แนะนำให้ตั้ง Token expiration (30/90 วัน) และ revoke เมื่อไม่ใช้แล้ว

---

## 🔐 ตั้งค่า Firebase (Google Login + Admin)

### ขั้นที่ 1 — สร้าง Firebase Project
1. ไปที่ [console.firebase.google.com](https://console.firebase.google.com)
2. กด **Add project** → ตั้งชื่อ เช่น `machine-pm`
3. เลือก **Continue** (ไม่ต้องเปิด Analytics)

### ขั้นที่ 2 — เปิด Authentication
1. เมนูซ้าย → **Authentication** → **Get started**
2. แท็บ **Sign-in method** → เลือก **Google** → เปิดใช้งาน → **Save**

### ขั้นที่ 3 — เปิด Firestore
1. เมนูซ้าย → **Firestore Database** → **Create database**
2. เลือก **Start in production mode** → เลือก Region ใกล้ที่สุด (asia-southeast1)
3. ไปที่แท็บ **Rules** แล้วแก้เป็น:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own doc
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    // Only authenticated users can read config & logs
    match /config/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /pmLogs/{doc} {
      allow read, write: if request.auth != null;
    }
    match /activityLogs/{doc} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

4. กด **Publish**

### ขั้นที่ 4 — เพิ่ม Web App
1. Project Overview → กด **</>** (Web)
2. ตั้งชื่อ App เช่น `pm-web`
3. คัดลอก **firebaseConfig** ที่ได้

### ขั้นที่ 5 — เพิ่ม Authorized Domain
1. Authentication → **Settings** → **Authorized domains**
2. กด **Add domain** → ใส่ `[username].github.io`

### ขั้นที่ 6 — กรอก Config ในแอป
เปิดแอปครั้งแรก จะเห็นหน้า "ตั้งค่า Firebase" ให้กรอก:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

กด **บันทึกและเข้าสู่ระบบ**

### ขั้นที่ 7 — ตั้ง Admin คนแรก
1. Login ด้วย Google account ของตัวเองก่อน (จะเป็น "pending")
2. ไปที่ Firestore Console → collection `users` → หา document ของตัวเอง
3. แก้ field `role` จาก `pending` เป็น `admin`
4. หรือ: กด "ตั้งค่า Firebase" → เพิ่ม email ของตัวเองใน **Admin Emails** แล้ว login ใหม่

---

## 🛡️ สิทธิ์การใช้งาน

| Role | สิ่งที่ทำได้ |
|------|-------------|
| **Admin** | เข้า Admin Panel, จัดการ User, เพิ่ม/ลบ/แก้ไข Machine & Person, ดู Activity Log, ตั้งค่า Gist Token |
| **User** | บันทึก PM, ดู Dashboard, Export ข้อมูล |
| **Pending** | รอ Admin Approve ก่อนเข้าใช้งาน |
| **Blocked** | ถูกระงับ ไม่สามารถเข้าระบบได้ |
