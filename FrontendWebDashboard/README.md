# Subtitle QC & Repositioning Frontend (React)

A streamlined, accessible UI focused only on:
- Uploading a video and optional subtitle file to run a Subtitle Quality Check
- Requesting subtitle repositioning based on burnt-in (hardcoded) text detection
- Previewing video playback with overlaid subtitles and visualization of detected burnt-in regions
- Downloading corrected/repositioned subtitle output

All unrelated features (translations, general subtitle management, admin, notifications, jobs listing, themes, or other non-essential UI) have been removed.

## Environment Variables

Create a `.env` file in this folder with:
```
# If your backend runs on port 3001:
REACT_APP_API_BASE_URL=http://localhost:3001

# If your backend runs on the default 8000 port:
# REACT_APP_API_BASE_URL=http://localhost:8000
```
The orchestrator will set these in CI/CD environments. Do not hard-code API URLs.

Troubleshooting:
- If you see “Failed to fetch” when testing backend, ensure the backend is running and that REACT_APP_API_BASE_URL matches the backend URL and port.
- Example: Frontend on http://localhost:3000 and Backend on http://localhost:3001 -> set REACT_APP_API_BASE_URL=http://localhost:3001
- CORS: The backend is configured to allow CORS via CORS_ALLOW_ORIGINS; by default it allows “*”. If you have custom origins, set CORS_ALLOW_ORIGINS on the backend accordingly.

## Scripts

- `npm start` - start development server
- `npm test` - run tests
- `npm run build` - build for production

## Routes (only essentials)

- `/` - Home
- `/upload` - Upload video/subtitles and start QC or Repositioning (invokes POST /upload)
- `/preview/:sessionId` - Preview video with subtitle overlay and burnt-in detection visualization; polls preview metadata, detections, and updated cues

## Accessibility and Responsiveness

- Keyboard navigable controls
- ARIA roles and labels for assistive tech
- Fluid layout with responsive components

## Backend API expectations

This frontend expects the backend to expose:
- `POST /upload` - multipart with `video`, optional `subtitle`, `mode` where mode is `quality_check` or `reposition`
- `GET /preview/:sessionId` - returns metadata to stream or access a processed session's assets
- `GET /sessions/:sessionId/detections` - list of burnt-in text detections (time ranges and bounding boxes per frame/segment)
- `GET /sessions/:sessionId/subtitles` - returns updated cues for preview overlay
- `GET /sessions/:sessionId/download` - download corrected/repositioned subtitle file
