@echo off
cd /d "%~dp0"
echo Starting Profecta Solutions website...
start "" "http://127.0.0.1:4173/"
node serve.mjs
