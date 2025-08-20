#!/bin/bash
cd /home/kavia/workspace/code-generation/audio-subtitle-sync-87778-87981/FrontendWebDashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

