@echo off
setlocal

rem Usage:
rem   Double-click: processes every PNG in THIS folder (tools\).
rem   Drag a folder onto this .cmd: processes every PNG in that folder instead.
rem   Make-PngTransparent.cmd "C:\path\to\folder" [tolerance]

set "TARGET_FOLDER=%~dp0"
if not "%~1"=="" set "TARGET_FOLDER=%~1"

rem Strip a trailing backslash - "%~dp0" always ends with one, and a path
rem ending in \ right before a closing " breaks argument parsing (\" reads
rem as an escaped quote instead of end-of-argument).
if "%TARGET_FOLDER:~-1%"=="\" set "TARGET_FOLDER=%TARGET_FOLDER:~0,-1%"

set "TOLERANCE=28"
if not "%~2"=="" set "TOLERANCE=%~2"

echo Removing backgrounds from PNGs in: %TARGET_FOLDER%
echo Tolerance: %TOLERANCE%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Make-PngTransparent.ps1" -Folder "%TARGET_FOLDER%" -Tolerance %TOLERANCE%

echo.
pause
