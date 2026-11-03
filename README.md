# FileFixer

FileFixer is a React and Vite app with browser based PDF/image tools and an optional Python service for document conversion and PDF passwords. The site does not have accounts or a login/signup flow.

## Run locally

1. Install the frontend packages with `npm install` and start the site with `npm run dev`. Vite also starts the PDF tools API on port 8000 and proxies requests at `/pdf-api` to it.
2. The PDF tools API needs Python packages from `backend/requirements.txt`. If Python dependencies are missing, install them with `python -m pip install -r backend/requirements.txt` and restart Vite.
3. The optional newsletter service runs with `npm start` from `backend`; configure `EMAIL_USER` and `EMAIL_PASS` in `backend/.env` to enable mail delivery.

For a production frontend, deploy the Python document API separately and set `VITE_PDF_API_URL` to its public base URL at build time. The local `/pdf-api` proxy is provided by the Vite development server and is not included in production builds. Set `VITE_API_URL` for the optional newsletter API if it is hosted somewhere other than `http://localhost:5000`.

PDF to Excel extracts selectable PDF text into workbook rows. Scanned PDFs need OCR first; complex layouts may need spreadsheet cleanup after extraction.
