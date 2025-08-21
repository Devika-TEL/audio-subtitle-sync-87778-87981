# Audio-Subtitle Sync Frontend Dashboard (React)

A responsive, accessible dashboard that lets users:
- Upload videos and optional subtitle files
- Monitor processing jobs
- Manage, edit, and download subtitles
- Request translations
- Access admin metrics and logs

## Environment Variables

Create a `.env` file in this folder with:
```
REACT_APP_API_BASE_URL=http://localhost:8000
```
The orchestrator will set these in CI/CD environments. Do not hard-code API URLs.

## Scripts

- `npm start` - start development server
- `npm test` - run tests
- `npm run build` - build for production

## Routes

- `/` - Home
- `/upload` - Upload video/subtitles
- `/jobs` - Monitor jobs
- `/manage` - Manage and edit subtitles
- `/translate` - Request translations
- `/admin` - Admin dashboard

## Accessibility and Responsiveness

- Keyboard navigable controls
- ARIA roles and labels for assistive tech
- Fluid layout with responsive components

## Notes

This frontend expects the backend to expose:
- `POST /upload` - multipart with `video`, optional `subtitle`, `mode`
- `GET /jobs` - list of jobs with progress, status, and `download_path`
- `GET /subtitles` - list of available subtitle items
- `GET /subtitles/{id}` - return editable cues
- `POST /subtitles/{id}` - save edited cues
- `GET /subtitles/{id}/download` - download subtitle file
- `POST /subtitles/{id}/translate` - request translation targets
- `GET /admin/metrics` and `GET /admin/logs` - admin info
