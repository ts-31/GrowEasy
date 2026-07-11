# GrowEasy CSV Importer

An AI-powered CSV importer that intelligently maps any CSV format into GrowEasy CRM fields using the xAI Grok API.

**Position applied for:** Software Developer Intern

---

## Features

- **Drag & Drop upload** — accepts any `.csv` file
- **CSV Preview** — renders raw data in a scrollable table before AI processing
- **AI Field Extraction** — Grok intelligently maps unknown column names to 15 CRM fields
- **Batch Processing** — sequential batch processing with configurable batch size
- **Results Dashboard** — summary stats + colour-coded CRM table with all extracted records
- **Dark Mode** — system-aware with manual toggle
- **Error Handling** — per-record, per-batch, and full-request error coverage

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Node.js, Express, TypeScript, tsx |
| AI       | xAI Grok via `@langchain/xai` + Zod structured output |
| CSV      | `csv-parse` (backend), PapaParse (frontend preview) |
| Table    | @tanstack/react-table |

---

## Project Structure

```
GrowEasy/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js pages + layout
│   │   ├── components/    # UI components
│   │   ├── hooks/         # useCsvParser, useImport
│   │   ├── services/      # importService (axios)
│   │   └── types/         # CrmRecord, ImportResult
│   └── .env.local         # NEXT_PUBLIC_API_URL
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/   # importController, extractController
│   │   ├── services/      # csvService, aiService, batchService
│   │   ├── prompts/       # extractionPrompt (separate from logic)
│   │   ├── routes/        # /api/import, /api/extract, /health
│   │   ├── middleware/    # multerConfig, errorHandler
│   │   └── types/         # CrmRecord, CsvParseResult
│   ├── uploads/           # Temp file storage (auto-deleted after use)
│   └── .env               # XAI_API_KEY, BATCH_SIZE, etc.
│
└── frontend/csv/      # Sample CSV files for testing
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- An xAI API key from [console.x.ai](https://console.x.ai)

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd GrowEasy
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
XAI_API_KEY=your_xai_api_key_here
XAI_MODEL=grok-3-mini
BATCH_SIZE=20
```

```bash
# Start backend in development mode (auto-reloads on save)
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
# Start frontend in development mode
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `FRONTEND_URL` | No | `http://localhost:3000` | CORS allowed origin |
| `XAI_API_KEY` | **Yes** | — | xAI API key from console.x.ai |
| `XAI_MODEL` | No | `grok-3-mini` | Grok model to use |
| `BATCH_SIZE` | No | `20` | Records per AI batch |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000` | Backend base URL |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check |
| `POST` | `/api/import` | Upload CSV → AI extraction → CRM records |
| `POST` | `/api/extract` | Extract a single raw record (JSON body) |

### `POST /api/import`

```bash
curl -X POST http://localhost:5000/api/import \
  -F "file=@frontend/csv/facebook_leads.csv;type=text/csv"
```

Response:
```json
{
  "success": true,
  "summary": {
    "totalRecords": 25,
    "importedRecords": 24,
    "skippedRecords": 1,
    "failedBatches": 0
  },
  "records": [...]
}
```

---

## Sample CSV Files

Four sample CSV files are included in `frontend/csv/` with intentionally varied column names and layouts to test AI field mapping:

| File | Format |
|------|--------|
| `facebook_leads.csv` | Facebook Ads Lead Export |
| `google_ads_leads.csv` | Google Ads Export |
| `real_estate_crm.csv` | Real Estate CRM Export |
| `messy_contacts.csv` | Manually created / mixed layout |

---

## CRM Fields Extracted

`created_at` · `name` · `email` · `country_code` · `mobile_without_country_code` · `company` · `city` · `state` · `country` · `lead_owner` · `crm_status` · `crm_note` · `data_source` · `possession_time` · `description`
