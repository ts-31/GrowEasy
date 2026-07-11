# GrowEasy CSV Importer

> **AI-powered CSV importer** that intelligently maps any CSV format into GrowEasy CRM fields using the xAI Grok API — no manual column mapping required.

**Position Applied For:** Software Developer Intern

---

## Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | https://grow-easy-15ro.vercel.app |
| ⚙️ **Backend API** | https://grow-easy-fzco-ten.vercel.app |

> **Note:** The backend is deployed on Vercel's free Hobby tier, which enforces a **15-second serverless timeout**. For evaluation, please use the built-in sample files (5 records each) to stay within this limit. For production use with large CSVs, deploy the backend to **Render** or **Railway** (no timeout limits).

---

## Features

- 🖱️ **Drag & Drop CSV Upload** — with instant client-side file validation
- 👁️ **Live Preview** — raw CSV data rendered in a beautiful scrollable table before any AI processing
- 🤖 **Grok AI Extraction** — intelligently maps unknown column names to 15 CRM fields
- 📦 **Batch Processing** — sequential batches with configurable size, resilient to partial failures  
- 📊 **Results Dashboard** — summary cards + colour-coded CRM table with all 15 extracted fields
- 🌙 **Dark Mode** — system-aware with a manual toggle in the navbar
- ⚡ **Sample Files** — one-click load of 4 pre-built sample CSVs to test instantly
- 🛡️ **Error Handling** — per-record, per-batch, and full-request error coverage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express 5, TypeScript, tsx |
| AI | xAI Grok via `@langchain/xai` + Zod structured output |
| CSV Parsing | `csv-parse` (backend), PapaParse (frontend preview) |
| Table | @tanstack/react-table v8 |
| File Upload | Multer (backend), react-dropzone (frontend) |

---

## Project Structure

```
GrowEasy/
├── frontend/              # Next.js 16 application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages + layout
│   │   ├── components/
│   │   │   ├── common/    # Navbar
│   │   │   ├── import/    # ImportLoading, ImportResults
│   │   │   ├── table/     # CsvTable, CrmTable
│   │   │   ├── upload/    # UploadCard, CsvPreview
│   │   │   └── ui/        # shadcn/ui primitives
│   │   ├── hooks/         # useCsvParser, useImport
│   │   ├── services/      # importService (axios)
│   │   └── types/         # CrmRecord, ImportResult, CsvParseResult
│   └── public/csv/        # Sample CSV files (5 records each)
│
└── backend/               # Express 5 API
    ├── src/
    │   ├── controllers/   # importController, extractController
    │   ├── services/      # csvService, aiService, batchService
    │   ├── prompts/       # extractionPrompt (decoupled from logic)
    │   ├── routes/        # /api/import, /api/extract, /health
    │   ├── middleware/    # multerConfig, errorHandler
    │   └── types/         # CrmRecord, CsvParseResult
    └── uploads/           # Temp files (auto-deleted after processing)
```

---

## Local Setup

### Prerequisites
- **Node.js 18+**
- An **xAI API key** from [console.x.ai](https://console.x.ai)

---

### 1. Clone the repository

```bash
git clone https://github.com/ts-31/GrowEasy.git
cd GrowEasy
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxx
XAI_MODEL=grok-3-mini
BATCH_SIZE=20
```

```bash
npm run dev
# ➜ Server running at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
# ➜ App running at http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | **Yes** | `http://localhost:3000` | CORS allowed origin |
| `XAI_API_KEY` | **Yes** | — | xAI API key from console.x.ai |
| `XAI_MODEL` | No | `grok-3-mini` | Grok model name |
| `BATCH_SIZE` | No | `20` | Records processed per AI batch |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000` | Backend base URL |

---

## API Reference

### `GET /health`
Simple health check endpoint.

```bash
curl https://grow-easy-fzco-ten.vercel.app/health
# → { "status": "ok", "timestamp": "..." }
```

### `POST /api/import`
Upload a CSV file → AI extraction → CRM records.

```bash
curl -X POST http://localhost:5000/api/import \
  -F "file=@frontend/public/csv/facebook_leads.csv;type=text/csv"
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalRecords": 5,
    "importedRecords": 5,
    "skippedRecords": 0,
    "failedBatches": 0
  },
  "records": [
    {
      "created_at": "2023-10-27T10:00:00+0000",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "country_code": "",
      "mobile_without_country_code": "5550101",
      "company": "Acme Corp",
      "city": "New York",
      "state": "",
      "country": "",
      "lead_owner": "",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "",
      "data_source": "",
      "possession_time": "",
      "description": ""
    }
  ]
}
```

### `POST /api/extract`
Extract a single raw record (for testing).

```bash
curl -s -X POST http://localhost:5000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","email":"john@example.com","phone":"9876543210"}'
```

---

## Sample CSV Files

Four sample CSVs are included in `frontend/public/csv/` with intentionally varied column names:

| File | Format | Records |
|---|---|---|
| `facebook_leads.csv` | Facebook Ads Lead Export (ad_name, campaign, platform) | 5 |
| `google_ads_leads.csv` | Google Ads Export (keywords, ad groups, campaign type) | 5 |
| `real_estate_crm.csv` | Real Estate CRM (project interest, budget, possession) | 5 |
| `messy_contacts.csv` | Manually created / mixed (multiple emails, no phone, etc.) | 5 |

---

## CRM Fields Extracted

| Field | Description |
|---|---|
| `created_at` | Lead creation date |
| `name` | Full name |
| `email` | Primary email |
| `country_code` | Country dialing code (e.g. +91) |
| `mobile_without_country_code` | Mobile number without country code |
| `company` | Company / organisation |
| `city` | City |
| `state` | State / province |
| `country` | Country |
| `lead_owner` | Assigned owner / agent |
| `crm_status` | `GOOD_LEAD_FOLLOW_UP` / `DID_NOT_CONNECT` / `BAD_LEAD` / `SALE_DONE` |
| `crm_note` | Extra remarks, extra phones/emails, follow-up notes |
| `data_source` | `leads_on_demand` / `meridian_tower` / `eden_park` / `varah_swamy` / `sarjapur_plots` |
| `possession_time` | Property possession timeline |
| `description` | Additional context |
