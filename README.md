# GreenLens

A PDF analysis application that processes documents to extract ESG (Environmental, Social, and Governance) insights using AI-powered text analysis and retrieval systems.

[Demo Video](https://www.youtube.com/watch?v=dwTzye-_Ql4)

[Deployed App](https://green-lens-eta.vercel.app/)

[Product Notes](PRODUCT_NOTES.md)

## Tech Stack

### Backend

- FastAPI for APIs

  - `POST /upload-pdf/` - Upload PDF file
  - `GET /process/{file_key}` - Process uploaded PDF (SSE stream)

- LlamaIndex for RAG

  - BM25 + Vector-Based Retrieval

- Tesseract for OCR

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- react-pdf-viewer

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Python 3.8+ and Tesseract OCR or Docker

### 1. Clone the Repository

```bash
git clone https://github.com/VitikaSoni/green-lens.git
cd green-lens
```

### 2. Backend Setup

With docker:

```bash
cd backend

# Build the image
docker build -t greenlens-backend .

# Run the container
docker run -p 8001:8000 greenlens-backend
```

Without docker:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Run the server (on port 8001)
python run.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Run the application (on port 5132)
npm run dev
```
