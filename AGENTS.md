# AGENTS.md

## Local Development Ports Registry (MANDATORY)

ALWAYS use the assigned ports for the E-Commerce suite:
- **Admin Ecommerce Frontend**: `http://localhost:5190` (Port 5190)
- **Website Ecommerce Astro**: `http://localhost:4390` (Port 4390)
- **Admin Ecommerce Backend**: `http://localhost:8090` or `http://admin-ecommerce-backend.test` (Port 8090)

DO NOT use ports reserved by other systems:
- FinanzAI: `5180`, `8010`, `3001`, `3200`, `3300`
- Concreces: `5181`, `8011`, `4321`

## Credentials
- Admin Email: `admin@admin.com`
- Admin Password: `admin123`

## File & Path Naming Rules (MANDATORY - Cross-Platform Compatibility)

NEVER create, rename, or save files/directories with:
- Trailing or leading spaces in folder or file names (e.g. `Folder /` or `File.txt `).
- Trailing dots before file extensions or at the end of folder names (e.g. `file..png` or `Folder.`).
- Non-standard spaces like narrow non-breaking spaces (`\u202f`, `\xa0`).
- Windows-forbidden characters (`< > : " / \ | ? *`).

ALWAYS sanitize file/directory names when adding images, screenshots, assets, or docs to ensure 100% compatibility with Windows Git checkouts.
