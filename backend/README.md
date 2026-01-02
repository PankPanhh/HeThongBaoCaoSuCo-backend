# 🚀 Quick Report Backend

Backend API cho tính năng Báo cáo Sự cố Nhanh.

## Cài đặt

```bash
cd backend
npm install
```

## Chạy Development

```bash
npm run dev
```

Server: `http://localhost:3000`

## API Endpoints

### 📸 Upload Image
```
POST /api/incidents/upload-image
Content-Type: multipart/form-data
Body: file (image)
```

### 📋 Create Quick Report
```
POST /api/incidents/quick-report
Content-Type: application/json
{
  "imageUrl": "...",
  "type": "dien",
  "location": "...",
  "description": "...",
  "timestamp": "2024-12-25T10:00:00Z"
}
```

### 📊 Get All Incidents
```
GET /api/incidents
GET /api/incidents?status=NEW
GET /api/incidents?source=ZALO_MINI_APP_QUICK
```

### 🔍 Get By ID
```
GET /api/incidents/:id
```

### ⚙️ Update Status
```
PUT /api/incidents/:id/status
{
  "status": "Đã xử lý",
  "note": "..."
}
```

### 📈 Statistics
```
GET /api/incidents/stats/overview
```

### ❤️ Health Check
```
GET /api/health
```

## Cấu trúc

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── controllers/
│   │   └── incidentController.ts
│   ├── services/
│   │   ├── incidentService.ts
│   │   └── fileService.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── incidents.ts
│   └── middleware/
│       └── index.ts
├── uploads/                   # Upload directory
├── package.json
├── tsconfig.json
└── .env
```

## Note

Hiện tại dùng **in-memory storage** cho development.  
Production: Cần migrate sang MongoDB/PostgreSQL.
