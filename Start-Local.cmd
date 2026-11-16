@echo off
title Medicare - local reminder planner
cd /d "%~dp0"
echo This opens Medicare on this PC. Keep this window open for reminders.
echo Records stay in your browser; enable folder backup from the information button.
echo No administrator access or automatic downloads are used. Node.js 22+ is required.
node --env-file-if-exists=.env.local server.cjs
pause
